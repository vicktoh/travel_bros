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
} from "@/components/ui/form";

import { useRegistrationStore } from "@/states/drivers";
import { RegistrationInfo, genders } from "@/types/Driver";
import { format, sub } from "date-fns";
import React, { ChangeEvent, FC} from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";




import { registrationSchema } from "./vehicle-registration-modal";
import { RegistrationInfoWithId } from "@/types/Admin";




type ContactInfoFilter = Pick<
  RegistrationInfo,
 "lastUpdated"
> | Partial<RegistrationInfo["driverLicense"]>;


type DriverLicenceFormProps = {
  form: UseFormReturn<z.infer<typeof registrationSchema>>,
  onSelectFrontFile: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectBackFile: (e: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onNext: () => void;
  registration?: RegistrationInfoWithId;
}
  const  DriverLicenceForm: FC<DriverLicenceFormProps> = ({form, onSelectFrontFile, onSelectBackFile, onClose, registration, onNext}) => {
  
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
        <FormField
          control={form.control}
          name="driverLicense.driverLicenseNumber"
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
          name="driverLicense.issuingState"
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
            name="driverLicense.dateIssued"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem className="mb-5">
                <FormLabel>Date Issued</FormLabel>
                <Input
                  value={
                    registration?.driverLicense?.dateIssued ||
                    (value ? format(value, "yyyy-MM-dd") : "")
                  }
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
            name="driverLicense.expiryDate"
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
                name="driverLicense.frontUrl"
                render={({ field }) => (
                  <>
                    {field.value ? (
                      <img src={field.value} className="w-[100%] h-[160px]" />
                    ) : (
                      <div className="flex border items-center justify-center border-primary-foreground rounded-md flex-col h-[83px] max-w-[300px]">
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
                name="driverLicense.backUrl"
                render={({ field }) => (
                  <>
                    {field.value ? (
                      <img src={field.value} className="w-[100%] h-[160px]" />
                    ) : (
                      <div className="flex border items-center justify-center border-primary-foreground rounded-md flex-col h-[83px] max-w-[300px]">
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
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Button
            size="lg"
            className="mt-5 border-primary-light"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="text-white mt-5"
            type="button"
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DriverLicenceForm;
