import { HeroForm } from "@/components/HeroForm";
import { ReturnTrip } from "@/types/Booking";
import React, { FC } from "react";
type EmptyStateProps = {
  trip?: ReturnTrip;
};
export const EmptyState: FC<EmptyStateProps> = ({ trip }) => {
  return (
    <div className="flex flex-col items-center px-5 py-3 ">
      <h1 className="text-2xl text-primary font-bold my-5">
        Sorry! no trip found
      </h1>
      <p className="text-base text-slate-600">
        Sorry, there are no available trips on this day. Select another day
      </p>
         <HeroForm replace={true}/>
    </div>
  );
};
