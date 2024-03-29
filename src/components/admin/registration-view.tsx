import { ApproveRegParams, RegistrationInfoWithId } from "@/types/Admin";
import React, { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/services/utils";
import { format } from "date-fns";
import { Button } from "../ui/button";
import Link from "next/link";
import { LucideCheck, LucideFileX, LucideLoader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { approveRegistration } from "@/services/admin";
import { VehicleApprovalForm } from "./vehicle-approval-form";
type RegistrationOverViewProps = {
  reg: RegistrationInfoWithId;
  onCloseModal?: ()=> void;
};
export const RegistrationOverView: FC<RegistrationOverViewProps> = ({
  reg,
  onCloseModal
}) => {
   const [step, setStep] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);
   const {toast} = useToast();
   const licenceInformation = () => {
      if(!reg.driverLicense) return null;
      return (
        <>
          <p className="text-base font-bold">Lincense Information</p>
          <div className="grid grid-cols-2 gap-5 my-3">
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">
                Lincense Number
              </p>
              <p className="text-base">
                {reg.driverLicense.driverLicenseNumber}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">Issuing State</p>
              <p className="text-base">{reg.driverLicense.issuingState}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">Date Issued</p>
              <p className="text-base">{reg.driverLicense.dateIssued}</p>
            </div>

            <div className="flex flex-col col-span-2 md:col-span-3">
              <p className="text-sm font-bold text-slate-500">Expiry Date</p>
              <p className="text-base">{reg.driverLicense.expiryDate}</p>
            </div>

            <div className="flex">
              <img
                className="w-full"
                src={reg.driverLicense.frontUrl}
                alt="driver license front"
              />
            </div>
            <div className="flex">
              <img
                className="w-full"
                src={reg.driverLicense.backUrl}
                alt="driver license front"
              />
            </div>
          </div>
        </>
      );
   }
   const vehicleInformation =  () => {
      const {vehicleInformation} = reg;
      if(!vehicleInformation) return null
      return (
        <>
          <p className="text-base font-bold">Vehicle Infomation</p>
          <div className="grid grid-cols-2 md:cols-3 gap-5 my-3">
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">Model</p>
              <p className="text-base">{vehicleInformation.model}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">
                Year of Manufacture
              </p>
              <p className="text-base">
                {vehicleInformation.yearOfManufacture}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">
                License Plate Number
              </p>
              <p className="text-base">
                {vehicleInformation.licensePlateNumber}
              </p>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">
                Vehicle Registration Number
              </p>
              <p className="text-base">
                {vehicleInformation.vehicleRegistrationNumber}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-500">
                Number of Seats
              </p>
              <p className="text-base">
                {vehicleInformation.numberOfSeats}
              </p>
            </div>
            <div className="flex flex-col col-span-3">
              <div className="grid grid-col-2 gap-3">
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-500">
                    Vehicle Registration Document
                  </p>
                  <Link
                    target="_blank"
                    href={vehicleInformation.registrationDocumentUrl}
                    className=""
                  >
                    <LucideFileX className="w-6 h-6" />
                  </Link>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-500">
                    Proof of Insurance
                  </p>
                  <Link
                    target="_blank"
                    href={vehicleInformation.proofOfInsurance}
                    className=""
                  >
                    <LucideFileX className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col col-span-3">
              <p className="text-sm font-bold text-slate-500">
                Employment History
              </p>
              <p className="text-base">
                {vehicleInformation.vehicleRegistrationNumber}
              </p>
            </div>
            {
               vehicleInformation.photos.map((photo, i)=> (
                  <div className="flex" key={`vehicle-image-${i}`}>
                     <img src={photo} className="w-[200px]" />
                  </div>
               ))
            }
          </div>
        </>
      );
   }
   const approvalForm = ()=> {
    return (
      <VehicleApprovalForm  registration={reg} onCloseModal={onCloseModal} />
    );
   }
   const next = ()=> {
      setStep((step) => Math.min(step + 1, 2))
   }
   const prev = ()=> {
      setStep((step) => Math.max(step - 1, 0 ))
   }
   const renderMap: Record<number, ()=> React.JSX.Element | null> = {
      0: licenceInformation,
      1: vehicleInformation,
      2: approvalForm,
   }

   
  return (
    <div className="flex flex-col w-full">
      {renderMap[step]()}

      <div className="flex items-center justify-between px-5 mt-5">
        <Button
          variant="outline"
          className="border-primary"
          size="sm"
          disabled={step === 0}
          onClick={prev}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          className="border-primary"
          size="sm"
          disabled={step === 3}
          onClick={next}
        >
          Next
        </Button>
      </div>
      
    </div>
  );
};
