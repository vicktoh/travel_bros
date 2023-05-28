"use client";
import React, { FC, useState } from "react";
import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { useRouter } from "next/navigation";
type ManageBookingFormProps = {
   onSubmitRef?: (ref: string) => void;
};
export const ManageBookingForm: FC<ManageBookingFormProps> = ({onSubmitRef}) => {
  const [ref, setRef] = useState<string>();
  const [err, setErr] = useState<string>();
  const router = useRouter();
  const onSubmit = () => {
    if (!ref) {
      setErr("Please enter a reference code");
      return;
    }
    if(onSubmitRef) {  
      onSubmitRef(ref);
      return;
   }
    const urlSearchParm = new URLSearchParams();
    urlSearchParm.set("ref", ref);
    router.push(`/bookings?${urlSearchParm.toString()}`);
  };
  return (
    <div className="flex md:flex-row flex-col mt-6 gap-3 md:items-center">
      <Input
        value={ref}
        onChange={(e) => setRef(e.target.value)}
        buttonSize="md"
        placeholder="Booking Reference code"
        error={err}
        className="md:min-w-[250px]"
      />
      <Button size="md" title="Manage" onClick={onSubmit}></Button>
    </div>
  );
};
