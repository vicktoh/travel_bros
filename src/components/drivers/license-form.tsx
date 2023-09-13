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
import { RegistrationInfo, genders } from "@/types/Driver";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, sub } from "date-fns";
import {  LucideLoader } from "lucide-react";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
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


export const licenseFormSchema = z.object({
   driverLicenseNumber: z.string().min(10, { message: "Must be at least 10 characters"}),
   dateIssued: z.coerce.date().max(new Date(), { message: "Cannot be in the future"}).min(sub(new Date(), { years: 5}), { message: "Must not be older than 5 years"}),
   expiryDate: z.coerce.date().min(new Date(), { message: "Must be in the future"}),
   issuingState: z.string(),
   frontUrl: z.string(),
   backUrl: z.string(),
});

type ContactInfoFilter = Pick<
  RegistrationInfo,
 "lastUpdated"
> | Partial<RegistrationInfo["driverLicense"]>;

export type DriverLicenseFormFields = z.infer<typeof licenseFormSchema>;

export default function DriverLicenceForm() {
  const {registration} = useRegistrationStore();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedFrontFile, setSelectedFrontFile] = useState<File>();
  const [frontProgress, setFrontProgress] = useState<number>();
  const [backProgress, setBackProgress] = useState<number>();
  const [selectedBackFile, setSelectedBackFile] = useState<File>();

  const { user } = useAuthStore();
  const toast = useToast();
  const form = useForm<z.infer<typeof licenseFormSchema>>({
    resolver: zodResolver(licenseFormSchema),
  });

  const onSelectFrontFile = (e: ChangeEvent<HTMLInputElement> ) => {
   const file = e.target?.files && e.target.files[0];
   if(file){
      setSelectedFrontFile(file);
      form.setValue("frontUrl", URL.createObjectURL(file))
   }
  }
  const onSelectBackFile = (e: ChangeEvent<HTMLInputElement> ) => {
   const file = e.target?.files && e.target.files[0];
   if(file){
      setSelectedBackFile(file);
      form.setValue("backUrl", URL.createObjectURL(file))
   }
  }
  useEffect(()=> {
    if(registration){
      registration.driverLicense && Object.entries(registration.driverLicense).forEach(([key, value], i)=> {
         form.setValue(key as keyof RegistrationInfo["driverLicense"],["dateIssued", "expiryDate"].includes(key) ? new Date(value): value);
      })
    }
  }, [registration])



  

  const onSaveLicenseForm = async (fields: DriverLicenseFormFields) => {
    const { backUrl:backFieldUrl, frontUrl:fielURl, ...rest} = fields;
    if (!user?.uid) return;
    const registrationPath = `registration/${user.uid}`;
    const licensePath = `licenses/${user.uid}`;
    if(selectedFrontFile){
      uploadDocument(selectedFrontFile, `${licensePath}-front`, setFrontProgress, async (url) => {
         setFrontProgress(undefined);
         setSelectedFrontFile(undefined);
         await updateDocument(`${registrationPath}`, { 'driverLicense.frontUrl': url})
      })
    }
    if(selectedBackFile){
      uploadDocument(selectedBackFile, `${licensePath}-back`, setBackProgress, async (url) => {
         setBackProgress(undefined);
         setSelectedBackFile(undefined);
         await updateDocument(`${registrationPath}`, {  "driverLicense.backUrl": url})
      })
    }
    const {backUrl, frontUrl  } = registration?.driverLicense || {}
    try {
      setSubmitting(true);
      const newRegistration = {
        driverLicense: {
         ...rest,
         dateIssued: format(fields.dateIssued, "yyyy-MM-dd"),
         expiryDate: format(fields.expiryDate, "yyyy-MM-dd"),
         ...(backUrl ? ({backUrl}): null),
         ...(frontUrl ? ({frontUrl}): null),
        },
        ...(registration?.dateCreated
          ? {}
          : { dateCreated: new Date().getTime() }),
        lastUpdated: new Date().getTime(),
        
      };
      if (registration) {
        await updateDocument(registrationPath, {"driversLicense": newRegistration.driverLicense});
      } else {
        await newDocument(registrationPath, newRegistration);
      }
      toast.toast({
        title: "Saved!"
      })

    } catch (error) {
      const err:any = error
      toast.toast({
        title: "Something went wrong while updating registration",
        variant: 'destructive',
        description: err?.message || "Unkown error"
      })
      
    } finally {
      
      setSubmitting(false);
    }
    
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Driver's License</CardTitle>
        <CardDescription className="text-sm">
          Please provide accurate and valid documentation for your driver's
          license
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSaveLicenseForm)} className="">
            <FormField
              control={form.control}
              name="driverLicenseNumber"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Driver's License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="A0353434343" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuingState"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>State Issued</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg. Bayelsa" {...field} />
                  </FormControl>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:grid md:gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dateIssued"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Date Issued</FormLabel>
                    <Input
                      value={registration?.driverLicense?.dateIssued || (value ? format(value, "yyyy-MM-dd") : "")}
                      type="date"
                      placeholder="Plateau"
                      {...rest}
                      onChange={(e) =>
                        form.setValue(rest.name, new Date(e.target.value))
                      }
                    />

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Expiry Date</FormLabel>
                    <Input
                      value={value ? format(value, "yyyy-MM-dd") : ""}
                      type="date"
                      placeholder="Plateau"
                      {...rest}
                      onChange={(e) =>
                        form.setValue(rest.name, new Date(e.target.value))
                      }
                    />

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-5 ">
              <div className="flex flex-col py-5 border border-primary-light rounded-md my-2 px-2">
                <p className="text-sm font-medium ml-5">Front View</p>
                <p className="text-xs ml-5">
                  Tap to box or image to select new image
                </p>

                <input
                  type="file"
                  accept="image/**"
                  className="hidden"
                  onChange={onSelectFrontFile}
                  name="front-input"
                  id="front-input"
                />
                <label htmlFor="front-input" className="mt-5 flex flex-col">
                  <FormField
                    control={form.control}
                    name="frontUrl"
                    render={({ field }) => (
                      <>
                        {field.value ? (
                          <img
                            src={field.value}
                            className="w-[100%] h-[160px]"
                          />
                        ) : (
                          <div className="flex border items-center justify-center border-primary-foreground rounded-md flex-col h-[83px] w-[300px]">
                            <p className="text-xs text-brand">
                              Click to select File
                            </p>
                          </div>
                        )}

                        <FormMessage className="text-xs" />
                      </>
                    )}
                  />
                </label>
                {frontProgress ? <Progress value={frontProgress} /> : null}
              </div>
              <div className="flex flex-col rounded-md py-5 border border-primary-light my-2 px-2">
                <p className="text-base font-medium ml-2">Back View</p>
                <p className="text-xs ml-2">
                  Tap to box or image to select new image
                </p>

                <input
                  type="file"
                  accept="image/**"
                  className="hidden"
                  onChange={onSelectBackFile}
                  
                  id="back-input"
                />
                <label htmlFor="back-input" className="mt-5">
                  <FormField
                    control={form.control}
                    name="backUrl"
                    render={({ field }) => (
                      <>
                        {field.value ? (
                          <img
                            src={field.value}
                            className="w-[100%] h-[160px]"
                            
                          />
                        ) : (
                          <div className="flex border items-center justify-center border-primary-foreground rounded-md flex-col h-[83px] w-[300px]">
                            <p className="text-xs text-brand">
                              Click to select File
                            </p>
                          </div>
                        )}

                        <FormMessage className="text-xs" />
                      </>
                    )}
                  />
                </label>
                {backProgress ? <Progress value={backProgress} /> : null}
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
