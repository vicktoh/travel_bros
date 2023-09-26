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

import { useAuthStore, useRegistrationStore } from "@/states/drivers";
import { RegistrationInfo } from "@/types/Driver";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideExternalLink,
  LucideFile,
  LucideLoader,
  LucideUpload,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  newDocument,
  updateDocument,
  uploadDocument,
} from "@/services/drivers";

import { useToast } from "../ui/use-toast";
import { Progress } from "../ui/progress";
import { arrayUnion } from "firebase/firestore";
import { Textarea } from "../ui/textarea";
const  MIN_PHOTO_UPLOAD = 4;
const  MAX_PHOTO_UPLOAD = 6;

export const vehicleFormSchema = z.object({
  model: z.string().min(1, { message: "Must be at least 5 characters" }),
  yearOfManufacture: z
    .string()
    .min(1, { message: "Must be at least 5 characters" }),
  numberOfSeats: z
    .string()
    .min(1, { message: "Must be at least 5 characters" }),
  licensePlateNumber: z.string(),
  vehicleRegistrationNumber: z.string(),
  registrationDocumentUrl: z.string(),
  proofOfInsurance: z.string(),
  photos: z.array(z.string()).min(4, { message: "Must be at least 4 photos" }),
  employmentHistory: z
    .string()
    .min(50, { message: "Must be at least 50 characters" }),
});

type ContactInfoFilter =
  | Pick<RegistrationInfo, "lastUpdated">
  | Partial<RegistrationInfo["driverLicense"]>;

export type VehicleRegistrationFormFields = z.infer<typeof vehicleFormSchema>;

export default function VehicleRegistration() {
  const { registration } = useRegistrationStore();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [photoUrls, setPhotoUrls] = useState<File[]>();
  const [profOfInsuranceFile, setProfOfInsurance] = useState<File>();
  const [profOfInsProgress, setProfOfInsProgress] = useState(0);
  const [vehicleRegFile, setVehicleRegFile] = useState<File>();
  const [vehicleRegProgress, setVehicleRegProgress] = useState(0);
  const { user } = useAuthStore();
  
  const toast = useToast();
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
  });

  const onSelectPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if(files.length < MIN_PHOTO_UPLOAD){
      toast.toast({variant: "destructive", title: "You must select At least " + MIN_PHOTO_UPLOAD + " photos"});
      return;
    }
    if(files.length > MAX_PHOTO_UPLOAD){
      toast.toast({variant: "destructive", title: "Maximum of " + MIN_PHOTO_UPLOAD + " photos allowed"});
      return;
    }
    setPhotoUrls(files);
    form.setValue("photos", files.map(file => URL.createObjectURL(file)));
  };
  const onSelectRegistrations = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (!file) return;
    setVehicleRegFile(file);
    form.setValue("registrationDocumentUrl", URL.createObjectURL(file))
  };
  const onSetProfOfIns = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (!file) return;
    setProfOfInsurance(file);
    form.setValue("proofOfInsurance", URL.createObjectURL(file))
  };



  useEffect(() => {
    if (registration) {
      registration.vehicleInformation &&
        Object.entries(registration.vehicleInformation).forEach(
          ([key, value], i) => {
            form.setValue(
              key as keyof RegistrationInfo["vehicleInformation"],
              value,
            );
          },
        );
    }
  }, [registration]);

  const uploadPhotos = () => {
    if (!photoUrls?.length) return;
    const registrationPath = `registration/${user?.uid}`;
    photoUrls.forEach((file, i) => {
      let insPath = `vehicle-registration/${user?.uid}-photos-${i}`;
      uploadDocument(
        file,
        insPath,
        (uploadProgress) => {
          setProgress((progress) => {
            progress[i] = uploadProgress;
            return progress;
          });
        },
        (url) => {
          updateDocument(registrationPath, {
            "vehicleInformation.photos": arrayUnion(url),
          });
        },
      );
    });
  };
  const onSaveLicenseForm = async (fields: VehicleRegistrationFormFields) => {
    if (!user?.uid) return;
    const registrationPath = `registration/${user.uid}`;
    const registrationDocumentPath = `vehicle-registration/vehicle-reg-${user.uid}`;
    const proofOfInsurancePath = `vehicle-registration/vehicle-ins-${user.uid}`;
    uploadPhotos();
    if (vehicleRegFile) {
      uploadDocument(
        vehicleRegFile,
        registrationDocumentPath,
        setVehicleRegProgress,
        async (url) => {
          setVehicleRegProgress(0);
          setVehicleRegFile(undefined);
          await updateDocument(`${registrationPath}`, {
            "vehicleInformation.registrationDocumentUrl": url,
          });
        },
      );
    }
    if (profOfInsuranceFile) {
      uploadDocument(
        profOfInsuranceFile,
        proofOfInsurancePath,
        setProfOfInsProgress,
        async (url) => {
          setProfOfInsProgress(0);
          setProfOfInsurance(undefined);
          await updateDocument(`${registrationPath}`, {
            "vehicleInformation.proofOfInsurance": url,
          });
        },
      );
    }
    const {
      photos: _,
      proofOfInsurance: _p,
      registrationDocumentUrl: _r,
      ...rest
    } = fields;
    const { photos, proofOfInsurance, registrationDocumentUrl } =
      registration?.vehicleInformation || {};
    try {
      setSubmitting(true);
      const newRegistration = {
        vehicleInformation: {
          ...rest,
          ...(photos ? { photos } : null),
          ...(proofOfInsurance ? { proofOfInsurance } : null),
          ...(registrationDocumentUrl ? { registrationDocumentUrl } : null),
        },
        ...(registration?.dateCreated
          ? {}
          : { dateCreated: new Date().getTime() }),
        lastUpdated: new Date().getTime(),
      };
      if (registration) {
        await updateDocument(registrationPath, {
          vehicleInformation: newRegistration.vehicleInformation,
        });
      } else {
        await newDocument(registrationPath, newRegistration);
      }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vehicle Registration</CardTitle>
        <CardDescription className="text-sm">
          Please provide accurate and valid documentation for the vehicle you
          will be operating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSaveLicenseForm)} className="">
            <div className="flex flex-col md:grid md:gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Vehicle Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota Siennna" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearOfManufacture"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Year of Manufacture</FormLabel>
                    <FormControl>
                      <Input placeholder="2001" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:grid md:gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="licensePlateNumber"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>License Plate Number</FormLabel>
                    <FormControl>
                      <Input placeholder="X53533" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfSeats"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Number of Passenger Seats</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Number of Seat" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="vehicleRegistrationNumber"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Vechicle Registration Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your vehicle registration code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employmentHistory"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Employment History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter your employment history as a driver or road transport worker"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:grid md:gap-8 md:grid-cols-2">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onSetProfOfIns}
                id="proof-of-ins"
              />
              <label htmlFor="proof-of-ins" className="mt-5">
                <FormField
                  control={form.control}
                  name="proofOfInsurance"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Attach Proof of Insurance</FormLabel>
                      <>
                        {field.value ? (
                          profOfInsuranceFile ? (
                            <div className="flex flex-col items-center">
                              <LucideFile className="text-primary mb-1" />
                              <p className="text-sm text-center font-medium">
                                {profOfInsuranceFile.name}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center h-[83px] justify-center border rounded-md">
                              <a href={field.value} target="_blank">
                                <LucideExternalLink className="h-4 w-4 text-primary" />
                              </a>
                              {registration?.vehicleInformation
                                .proofOfInsurance ? (
                                <p className="text-xs">
                                  View uploaded proof of insurance
                                </p>
                              ) : null}
                            </div>
                          )
                        ) : (
                          <div className="flex border items-center justify-center border-primary-foreground rounded-md flex-col h-[83px]">
                            <LucideUpload />
                            <p className="text-xs text-brand">
                              Click to select a PDF file
                            </p>
                          </div>
                        )}
                        {profOfInsProgress ? (
                          <Progress value={profOfInsProgress} className="h-2" />
                        ) : null}
                        <FormMessage className="text-xs" />
                      </>
                    </FormItem>
                  )}
                />
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onSelectRegistrations}
                id="reg-papers"
              />
              <label htmlFor="reg-papers" className="mt-5">
                <FormField
                  control={form.control}
                  name="registrationDocumentUrl"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Vehicle Registration Document</FormLabel>
                      <>
                        {field.value ? (
                          vehicleRegFile ? (
                            <div className="flex flex-col items-center">
                              <LucideFile className="text-primary mb-1" />
                              <p className="text-sm font-medium text-center">
                                {vehicleRegFile.name}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center border rounded-md h-[83px]">
                              <a href={field.value}>
                                <LucideExternalLink className="h-4 w-4" />
                              </a>
                              {registration?.vehicleInformation
                                .registrationDocumentUrl ? (
                                <p className="text-xs">
                                  View uploaded registration document
                                </p>
                              ) : null}
                            </div>
                          )
                        ) : (
                          <div className="flex border items-center justify-center border-primary-foreground rounded-md flex-col h-[83px]">
                            <LucideUpload />
                            <p className="text-xs text-brand">
                              Click to select a PDF file
                            </p>
                          </div>
                        )}
                        {vehicleRegProgress ? (
                          <Progress
                            value={vehicleRegProgress}
                            className="h-2"
                          />
                        ) : null}

                        <FormMessage className="text-xs" />
                      </>
                    </FormItem>
                  )}
                />
              </label>
            </div>

            <div className="flex flex-col mb-5 ">
              <div className="flex flex-col py-5 border border-primary-light rounded-md my-2 px-2">
                <p className="text-sm font-medium ml-5">Vehicle Photos</p>
                <p className="text-xs ml-5">
                  Tap to box or images to select images, select{" "}
                  <strong>at least 4 images</strong>
                </p>

                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  className="hidden"
                  onChange={onSelectPhotos}
                  multiple
                  name="photo-input"
                  id="photos"
                />
                <label htmlFor="photos" className="mt-5 grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="photos"
                    render={({ field }) => (
                      <>
                        {(field?.value || []).map((photo, i) => (
                          <div className="flex flex-col">
                            <img src={photo} className="w-full h-[83px]" />
                            {progress[i] && (
                              <Progress className="h-2" value={progress[i]} />
                            )}
                          </div>
                        ))}
                        {!field.value?.length && (
                          <div className="flex flex-col items-center justify-center border rounded-lg h-[83px] col-span-2">
                            <LucideUpload />

                            <p className="text-xs text-primary font-medium">
                              Click to select files
                            </p>
                          </div>
                        )}

                        <FormMessage className="text-xs" />
                      </>
                    )}
                  />
                </label>
              </div>
            </div>

            <Button
              size="lg"
              className="text-white w-full mt-5"
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
