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


import { useAuthStore, useDriverStore, useRegistrationStore } from "@/states/drivers";
import { RegistrationInfo } from "@/types/Driver";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  newDocument,
  updateDocument,
} from "@/services/drivers";

import { useToast } from "../ui/use-toast";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export const contactFormSchema = z.object({
   contact: z.object({
      address: z.string().min(10, { message: "Must be at least 10 characters"}),
      phoneNumber: z.string().min(11, { message: "Must be at least 11 characters"}),
      city: z.string(),
      state: z.string(),
   }),
   nextOfKinContact: z.object({
      name: z.string().min(5, { message: "Must be at least 5 characters"}),
      address: z.string().min(10, { message: "Must be at least 10 characters"}),
      phoneNumber: z.string().min(11, { message: "Must be at least 11 characters"}),
      relationship: z.string().min(1, { message: "Cannot be empty"}),
   })
});

type ContactInfoFilter = Pick<
  RegistrationInfo,
  "contact" | "nextOfKinContact" | "lastUpdated"
>;

export type ContactInfoFormFields = z.infer<typeof contactFormSchema>;

export default function ContactRegistrationForm() {
  const {registration} = useRegistrationStore();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { user } = useAuthStore();
  const {driver} = useDriverStore();
  const toast = useToast();
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      contact:{
         phoneNumber: user?.phoneNumber || undefined
      }
    },
  });

  useEffect(()=> {
    if(registration){
      console.log("setting registration", registration)
      registration.contact && form.setValue("contact", registration.contact);
      registration?.contact?.phoneNumber && form.setValue("contact.phoneNumber", registration.contact.phoneNumber);
      registration.nextOfKinContact && form.setValue("nextOfKinContact",registration.nextOfKinContact );
    }
  }, [registration])



  

  const onSaveContactForm = async (fields: ContactInfoFormFields) => {
    if (!user?.uid) return;
    const registrationPath = `registration/${user.uid}`;
    
    try {
      setSubmitting(true);
      const newRegistration: ContactInfoFilter = {
        contact: fields.contact,
        nextOfKinContact: fields.nextOfKinContact,
        ...(registration?.dateCreated
          ? {}
          : { dateCreated: new Date().getTime() }),
        lastUpdated: new Date().getTime(),
        
      };
      if (registration) {
        await updateDocument(registrationPath, newRegistration);
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
        <CardTitle className="text-base">Contact Information</CardTitle>
        <CardDescription className="text-sm">
          How do we contact you?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSaveContactForm)}
            className="max-w-[500px]"
          >
            <h3 className="font-bold text-base mb-3">Contact Info</h3>
            <Separator className="mb-5" />
            <FormField
              control={form.control}
              name="contact.phoneNumber"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input max={11} placeholder="08066475316" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.address"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Your permanent address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />

            <div className="grid gap-8 grid-cols-2">
              <FormField
                control={form.control}
                name="contact.state"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>State</FormLabel>
                    <Input placeholder="Plateau" {...field}  />

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.city"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>City</FormLabel>
                    <Input placeholder="Jos" {...field}  />

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <h3 className="font-bold text-base mb-3 mt-8">Next of Kin Info</h3>
            <Separator className="mb-5" />
            <FormField
              control={form.control}
              name="nextOfKinContact.name"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Next of Kin Fullname</FormLabel>
                  <FormControl>
                    <Input  placeholder="Adamu James" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="grid gap-8 grid-cols-2">

            <FormField
              control={form.control}
              name="nextOfKinContact.relationship"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g Employer" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextOfKinContact.phoneNumber"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input max={11} placeholder="08066475316" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            </div>
            <FormField
              control={form.control}
              name="nextOfKinContact.address"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Your permanent address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />
         
            

            <Button
              size="lg"
              className="text-white w-full mt-5"
              type="submit"
              disabled={driver?.status === "pending" || submitting || !form.formState.isValid}
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
