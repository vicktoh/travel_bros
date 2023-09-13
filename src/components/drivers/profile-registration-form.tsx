"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuthStore, useRegistrationStore } from "@/states/drivers";
import { RegistrationInfo, genders } from "@/types/Driver";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, sub } from "date-fns";
import { LucideLoader, LucidePencil } from "lucide-react";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/services/utils";
import { ImageCropper } from "../common/ImageCropper";
import {
  newDocument,
  updateDocument,
  uploadDocument,
} from "@/services/drivers";
import { updateProfile } from "firebase/auth";
import { useToast } from "../ui/use-toast";
import { Progress } from "../ui/progress";
import { auth } from "@/firebase";

export const personalInfoFormSchema = z.object({
  fullname: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" }),
  email: z.string().email("Must be a valid email address"),
  dateOfBirth: z.coerce
    .date({
      errorMap: () => ({ message: "Must be a valid date" }),
    })
    .max(sub(new Date(), { years: 21 }), {
      message: "Must be at least 21 years",
    }),
  gender: z.string(),
});

type PersonaInfoFilter = Pick<
  RegistrationInfo,
  | "fullname"
  | "email"
  | "dateCreated"
  | "lastUpdated"
  | "gender"
  | "dateOfBirth"
>;

export type PersonalInfoFormFields = z.infer<typeof personalInfoFormSchema>;
type ProfileRegistrationFormProps = {};
export default function ProfileRegistrationForm({}: ProfileRegistrationFormProps) {
  const { registration } = useRegistrationStore();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob>();
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const { user } = useAuthStore();
  const toast = useToast();
  const form = useForm<z.infer<typeof personalInfoFormSchema>>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      fullname: registration?.fullname || user?.displayName || "",
      email: registration?.email || user?.email || "",
      gender: registration?.gender,
      dateOfBirth: registration?.dateOfBirth
        ? new Date(registration.dateOfBirth)
        : undefined,
    },
  });

  useEffect(() => {
    if (registration) {
      console.log("setting registration", registration);
      form.setValue("fullname", user?.displayName || registration.fullname);
      registration.dateOfBirth &&
        form.setValue("dateOfBirth", new Date(registration.dateOfBirth));
      form.setValue("gender", registration.gender);
    }
  }, [registration]);

  const selectedPreviewUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);
  const croppedPreviewUrl = useMemo(() => {
    if (!croppedImageBlob) return "";
    return URL.createObjectURL(croppedImageBlob);
  }, [croppedImageBlob]);

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files ? e.target.files[0] : undefined;
    if (!file) return;
    setSelectedFile(file);
    setShowCropper(true);
  };

  const onSavePersonalInfoForm = async (fields: PersonalInfoFormFields) => {
    if (!user?.uid) return;
    const registrationPath = `registration/${user.uid}`;
    if (croppedImageBlob) {
      const path = `profiles/${user.uid}`;

      setUploading(true);
      uploadDocument(
        croppedImageBlob,
        path,
        (progress) => setProgress(progress),
        async (url) => {
          const usr = auth.currentUser;
          if (usr) {
            await updateProfile(usr, { photoURL: url });
          }
          await updateDocument(registrationPath, { photoURL: url });
          setProgress(0);
          setUploading(false);
        },
      );
    }
    try {
      setSubmitting(true);
      const newRegistration: PersonaInfoFilter = {
        fullname: fields.fullname,
        email: fields.email,
        gender: fields.gender as any,
        ...(registration?.dateCreated
          ? {}
          : { dateCreated: new Date().getTime() }),
        lastUpdated: new Date().getTime(),
        dateOfBirth: fields.dateOfBirth.getTime(),
      };
      if (registration) {
        await updateDocument(registrationPath, newRegistration);
      } else {
        await newDocument(registrationPath, newRegistration);
      }
      setCroppedImageBlob(undefined);
      setSelectedFile(undefined);
      toast.toast({
        title: "Saved!",
      });
    } catch (error) {
      const err: any = error;
      toast.toast({
        title: "Something went wrong while updating registration",
        variant: "destructive",
        description: err?.message || "Unkown error",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const cancleCrop = () => {
    setSelectedFile(undefined);
    setShowCropper(false);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Personal Info</CardTitle>
        <CardDescription className="text-sm">
          Lets get to know you better
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSavePersonalInfoForm)}
            className="max-w-[500px]"
          >
            <div className="relative max-w-fit my-5 ">
              {showCropper && selectedPreviewUrl ? (
                <ImageCropper
                  src={selectedPreviewUrl}
                  onCrop={setCroppedImageBlob}
                  onClose={cancleCrop}
                />
              ) : (
                <Avatar className=" w-32 h-32 bg-primary-light">
                  <AvatarFallback className="bg-primary-light">
                    {getInitials(user?.displayName || "Unknown")}
                  </AvatarFallback>
                  <AvatarImage
                    src={croppedPreviewUrl || user?.photoURL || ""}
                  />
                </Avatar>
              )}
              {progress && uploading ? (
                <Progress value={progress} className="my-4" />
              ) : null}
              <input
                accept="image/*"
                type="file"
                className="hidden"
                name="file-input"
                id="file-input"
                onChange={onFileSelected}
              />
              <label
                htmlFor="file-input"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "w-4 h-4 absolute bottom-1 -right-1",
                )}
              >
                <LucidePencil />
              </label>
            </div>
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input placeholder="John doe" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="youremail@example.com"
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Sex</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={`sex-select-${gender}`} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem className="mb-6 flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={value ? format(value, "yyyy-MM-dd") : ""}
                    placeholder="Your date of birth"
                    {...rest}
                    onChange={(e) => onChange(new Date(e.target.value))}
                  />

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button
              size="lg"
              className="text-white w-full"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <LucideLoader className="w-4 h-4 animate-spin text-white" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
