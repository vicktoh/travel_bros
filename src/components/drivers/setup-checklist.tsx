"use client";
import React, { ReactNode, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  LucideCarFront,
  LucideCheck,
  LucideCheckCircle,
  LucideClock11,
  LucideFileCheck,
  LucideUser2,
} from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDriverStore, useRegistrationStore } from "@/states/drivers";
import { isRegistrationComplete } from "@/services/utils";
type ChecklistItem = {
  title: string;
  icon: ReactNode;
  subtitle: string;
  path: string;
};
const checklistItems: ChecklistItem[] = [
  {
    title: "Personal Info/Contact Info",
    icon: <LucideUser2 className="w-8 h-8" />,
    subtitle:
      " Fill out your personal details accurately to start your journey as a luxury driver",
    path: "/drivers/registration/personal",
  },
  {
    title: "Vehicle Information",
    icon: <LucideCarFront className="w-8 h-8" />,
    subtitle:
      " Provide information about your vehicle, ensuring it meets our quality standards. Don't forget to add photos!",
    path: "/drivers/registration/vehicle",
  },
  {
    title: "Vehicle Inspection",
    icon: <LucideFileCheck className="w-8 h-8" />,
    subtitle:
      "Our team will conduct a thorough inspection to ensure your vehicle is in top-notch condition for a luxurious ride.",
    path: "/drivers/registartion/vehicle",
  },
];
export default function SetupChecklist() {
  const { driver } = useDriverStore();
  const { registration } = useRegistrationStore();
  const completeList = useMemo(() => {
    if (!registration) return [];

    const list = isRegistrationComplete(driver || {});
    return [list.contactInfo && list.personalInfo, registration, driver?.status === "active"];
  }, [registration, driver]);
  if(completeList.every((item)=> item === true)) return null;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Complete your registration to begin
        </CardTitle>
        <CardDescription>
          Complete your registration and upload all the neccessary documents and
          start your journey to luxry!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row align-item-center gap-5 md:justify-between py-8 w-full">
          {checklistItems.map((item, i) => (
            <div
              key={`checklist-item-${i}`}
              className="flex  flex-col items-center justify-center px-8 text-center gap-2"
            >
              {completeList[i] ? (
                <LucideCheck className="w-8 h-8 text-green-500" />
              ) : (
                item.icon
              )}
              <p className="text-base font-bold">{
              item.title
              }</p>
              <p className="text-sm">{item.subtitle}</p>
              {completeList[i] ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white mt-6 bg-green-500"
                >
                  <LucideCheckCircle className="h-4 w-4 mr-2" /> Completed
                </Button>
              ) : (
               driver?.status === 'pending' &&  i==2 ? <LucideClock11 className="h-8 w-8 text-orange-400  mt-6" /> : 
                <Link
                  href={item.path}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "text-white mt-6",
                  )}
                >
                  Get Started
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
