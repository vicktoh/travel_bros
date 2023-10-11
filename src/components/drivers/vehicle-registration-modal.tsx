"use client";
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { RegistrationInfoWithId } from "@/types/Admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import VehicleRegistration, { VehicleRegistrationFormFields, vehicleFormSchema } from "./vehicle-form";
import { Form } from "../ui/form";

import { useAuthStore } from "@/states/drivers";
import {
  newDocument,
  updateDocument,
  uploadDocument,
} from "@/services/drivers";
import { format, sub } from "date-fns";
import { useToast } from "../ui/use-toast";
import DriverLicenceForm from "./license-form";
import { newRegistration } from "@/services/utils";
const MIN_PHOTO_UPLOAD = 4;
const MAX_PHOTO_UPLOAD = 6;

export const licenseFormSchema = z.object({
  driverLicenseNumber: z
    .string()
    .min(10, { message: "Must be at least 10 characters" }),
  dateIssued: z.coerce
    .date()
    .max(new Date(), { message: "Cannot be in the future" })
    .min(sub(new Date(), { years: 5 }), {
      message: "Must not be older than 5 years",
    }),
  expiryDate: z.coerce
    .date()
    .min(new Date(), { message: "Must be in the future" }),
  issuingState: z.string(),
  frontUrl: z.string(),
  backUrl: z.string(),
});

type VehicleRegistrationModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  registration?: RegistrationInfoWithId;
};
type UploadDetails = {
  frontUrl: string;
  backUrl: string;
  proofOfIns: string;
  vehicleReg: string;
  photos: string[];
}
export const registrationSchema = z.object({
  driverLicense: licenseFormSchema,
  vehicleInformation: vehicleFormSchema,
});
type RegistrationFormType = z.infer<typeof registrationSchema>
export const VehicleRegistrationModal: FC<VehicleRegistrationModalProps> = ({
  isOpen,
  setOpen,
  registration,
}) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      vehicleInformation: { ...registration?.vehicleInformation },
      driverLicense: {
        ...(registration?.driverLicense
          ? {
              ...registration.driverLicense,
              dateIssued: new Date(registration.driverLicense.dateIssued),
              expiryDate: new Date(registration.driverLicense.expiryDate),
            }
          : {}),
      },
    },
  });
  const [selectedFrontFile, setSelectedFrontFile] = useState<File>();
  const [frontProgress, setFrontProgress] = useState<number>();
  const [backProgress, setBackProgress] = useState<number>();
  const [selectedBackFile, setSelectedBackFile] = useState<File>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadDetails, setUploadDetails] = useState<Partial<UploadDetails>>();
  const [progress, setProgress] = useState<number[]>([]);
  const [photoUrls, setPhotoUrls] = useState<File[]>();
  const [profOfInsuranceFile, setProfOfInsurance] = useState<File>();
  const [proofOfInsProgress, setProfOfInsProgress] = useState<number>();
  const [vehicleRegFile, setVehicleRegFile] = useState<File>();
  const [vehicleRegProgress, setVehicleRegProgress] = useState<number>();
  const [cacheSubmit, setCacheSubmit] = useState<RegistrationFormType & {id:string}>()
  const isUploading = useMemo(()=> {
    const isFrontUploading = frontProgress !== undefined;
    const isBackUploading = backProgress !== undefined;
    const isProofOfInsUploading = proofOfInsProgress !== undefined;
    const isVehicleRegUploading = vehicleRegProgress !== undefined;
    const photosUploading = photoUrls?.length !== uploadDetails?.photos?.length;
    console.log(uploadDetails?.photos)
    console.log({isFrontUploading, isBackUploading, isProofOfInsUploading, photosUploading, isVehicleRegUploading})
    return (
      isFrontUploading ||
      isBackUploading ||
      isProofOfInsUploading ||
      photosUploading ||
      isVehicleRegUploading
    );
  }, [frontProgress, backProgress, proofOfInsProgress, vehicleRegProgress, progress, uploadDetails])
  const toast = useToast();

  const onSelectFrontFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (file) {
      setSelectedFrontFile(file);
      form.setValue("driverLicense.frontUrl", URL.createObjectURL(file));
    }
  };
  const onSelectBackFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (file) {
      setSelectedBackFile(file);
      form.setValue("driverLicense.backUrl", URL.createObjectURL(file));
    }
  };

  console.log({state: form.formState.errors, isUploading})



  const onNext = () => {
    const  vals = form.getValues();
    console.log({vals})
    for( const key in vals.driverLicense){
      form.trigger(`driverLicense.${key}` as any);
    }
    const res = licenseFormSchema.safeParse(vals.driverLicense);
    if(!res.success) return;
    setStep(2);
  }
  const onSelectPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length < MIN_PHOTO_UPLOAD) {
      toast.toast({
        variant: "destructive",
        title: "You must select At least " + MIN_PHOTO_UPLOAD + " photos",
      });
      return;
    }
    if (files.length > MAX_PHOTO_UPLOAD) {
      toast.toast({
        variant: "destructive",
        title: "Maximum of " + MIN_PHOTO_UPLOAD + " photos allowed",
      });
      return;
    }
    setPhotoUrls(files);
    form.setValue(
      "vehicleInformation.photos",
      files.map((file) => URL.createObjectURL(file)),
    );
  };
  const onSelectRegistrations = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (!file) return;
    setVehicleRegFile(file);
    form.setValue(
      "vehicleInformation.registrationDocumentUrl",
      URL.createObjectURL(file),
    );
  };
  const onSetProfOfIns = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (!file) return;
    setProfOfInsurance(file);
    form.setValue(
      "vehicleInformation.proofOfInsurance",
      URL.createObjectURL(file),
    );
  };
  const onSaveVehicle = async (fields: RegistrationFormType) => {
    console.log({fields}, "Save Vehicles >>>>>")
    if (!user?.uid) return;
    const regRef = newRegistration();
    const registrationPath = `registration/${regRef.id}`;
    const registrationDocumentPath = `vehicle-registration/vehicle-reg-${regRef.id}`;
    const proofOfInsurancePath = `vehicle-registration/vehicle-ins-${regRef.id}`;
    const licensePath = `licenses/${user.uid}`;
    if (selectedFrontFile) {
      uploadDocument(
        selectedFrontFile,
        `${licensePath}-front`,
        setFrontProgress,
        async (url) => {
          setFrontProgress(undefined);
          setSelectedFrontFile(undefined);
          setUploadDetails((curr) =>  ({ ...(curr), frontUrl: url }));
        },
      );
    }
    if (selectedBackFile) {
      uploadDocument(
        selectedBackFile,
        `${licensePath}-back`,
        setBackProgress,
        (url) => {
          setBackProgress(undefined);
          setSelectedBackFile(undefined);
          setUploadDetails((curr) => ({ ...(curr), backUrl: url }));
          
        },
      );
    }
    if (vehicleRegFile) {
      uploadDocument(
        vehicleRegFile,
        registrationDocumentPath,
        (progress)=>setVehicleRegProgress(progress),
        (url) => {
          setVehicleRegProgress(undefined);
          setVehicleRegFile(undefined);
          setUploadDetails((curr) => curr && ({ ...(curr), vehicleReg: url }));
          
        },
      );
    }
    if (profOfInsuranceFile) {
      uploadDocument(
        profOfInsuranceFile,
        proofOfInsurancePath,
        (prog)=> {
          setProfOfInsProgress(prog)

        },
        (url) => {
          setProfOfInsProgress(undefined);
          setProfOfInsurance(undefined);
          setUploadDetails((curr) => ({ ...(curr), proofOfIns: url }));
          
        },
      );
    }
    uploadPhotos();
    if (registration && registration.id) {
      setCacheSubmit({
        id: registration.id,
        ...fields,

      })
    } else {
      setCacheSubmit({
        ...fields,
        id: regRef.id,
      })
    }
  };
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
          setUploadDetails((curr) => ({...curr,  photos: [...(curr?.photos || []), url]}))
        },
      );
    });
  };
  const onSaveRegistration = async () => {
    if(!user?.uid) throw new Error("Please login again to continue")
    if(!cacheSubmit) return;
    try {
      setSubmitting(true);
      const {frontUrl, photos, proofOfIns, vehicleReg,backUrl} = uploadDetails || {}
      const newRegistration: RegistrationInfoWithId = {
        ...(cacheSubmit),
        driverLicense:{
        ...(cacheSubmit.driverLicense),
        dateIssued: format(cacheSubmit.driverLicense.dateIssued, "yyyy-MM-dd"),
        expiryDate: format(cacheSubmit.driverLicense.expiryDate, "yyyy-MM-dd"),
        ...(frontUrl ? { frontUrl}: undefined),
        ...(backUrl ? {backUrl}: undefined),
        },
        vehicleInformation: {
          ...(cacheSubmit.vehicleInformation),
         ...( proofOfIns ?  {proofOfInsurance: proofOfIns}: undefined),
          ...(vehicleReg ?  {registrationDocumentUrl: vehicleReg}: undefined),
          ...(photos ? { photos: photos} : undefined)
        },
        lastUpdated: new Date().getTime(),
        dateCreated: new Date().getTime(),
        userId: user.uid,
        status: "pending"
      }
      if(registration){
        await updateDocument(`registration/${registration.id}`, {...registration, ...newRegistration})
      } else{
        await newDocument(`registration/${newRegistration.id}`, newRegistration)
      }
      setUploadDetails(undefined);
      setCacheSubmit(undefined)
      toast.toast({
        title: "Successfully Submitted Registration"
      })
      setOpen(false)
    } catch (error) {
      toast.toast({
        title: "Could not save registration please try again",
        variant: "destructive"
      })
    } finally{
      setSubmitting(false)
    }
  }
  useEffect(() => {
    if(!isUploading && cacheSubmit){
      onSaveRegistration()
    }
  }, [isUploading,cacheSubmit])
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[850px] p-8 ">
        
       
        <div className="max-h-[90vh] relative overflow-y-auto overflow-x-hidden px-3 ">
        <DialogHeader className="sticky top-0 mb-5 bg-white py-2">
          <DialogTitle>Vehicle Registration</DialogTitle>
          <DialogDescription>{`Step ${step} of 2`}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSaveVehicle)}>
            {step === 1 ? (
              <DriverLicenceForm
                onSelectBackFile={onSelectBackFile}
                onSelectFrontFile={onSelectFrontFile}
                form={form}
                onNext={onNext}
                onClose={() => setOpen(false)}
              />
            ) : null}
            {step === 2 ? (
              <VehicleRegistration
                form={form}
                progress={progress}
                onSelectPhotos={onSelectPhotos}
                submitting={isUploading || submitting}
                onSelectRegistrations={onSelectRegistrations}
                onSetProfOfIns={onSetProfOfIns}
                proofOfInsProgress={proofOfInsProgress}
                proofOfInsuranceFile={profOfInsuranceFile}
                vehicleRegFile={vehicleRegFile}
                vehicleRegProgress={vehicleRegProgress}
                goBack={() => setStep(1)}
              />
            ) : null}
          </form>
        </Form>
        </div>

      </DialogContent>
    </Dialog>
  );
};
