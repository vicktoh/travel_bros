import { Button } from "@/components/common/Button";
import { Player } from "@lottiefiles/react-lottie-player";
import React, { FC, useState } from "react";
import { FiCopy } from "react-icons/fi";

type SuccessProps = {
  paymentRef: string;
}
export const Success: FC<SuccessProps> = ({paymentRef}) => {
  const [copyState, setCopyState] = useState<string>('Copy');

  const onCopy = ()=> {
    navigator.clipboard.writeText(paymentRef);
    setCopyState("Copied")
    setTimeout(()=>{
      setCopyState("Copy")
    }, 2000)
  }
  return (
    <div className="flex flex-col items-center p-8 min-w-[400px]">
      <Player
        autoplay
        loop
        src="https://assets7.lottiefiles.com/private_files/lf30_uw1ao4fr.json"
        style={{ height: "300px", width: "242" }}
      ></Player>
      <p className="text-2xl font-bold text-primary text-center w-[70%] mt-5 mb-3">
        Your have successfully booked your trip
      </p>
      <p className="text-base w-[60%] text-slate-400 text-center">
        You have succesfully booked your trip here is your reference code
      </p>

      <div className="flex flex-row items-center justify-center bg-primary-light rounded-md py-3 px-5 my-3">
        <p className="text-base text-slate-600">{paymentRef}</p>
        <Button onClick={onCopy} size="sm" className=" flex justify-center items-center ml-3">
          {copyState}
          <FiCopy className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
