"use client";

import { MobileNav } from "@/components/drivers/mobile-nav";
import DriverNavBar from "@/components/drivers/nav-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  listenOnAuth,
  listenOnDriver,
  listenOnRegistration,
} from "@/services/drivers";
import {
  useAuthStore,
  useDriverStore,
  useRegistrationStore,
} from "@/states/drivers";
import { LucideClock4 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

export default function DriverClient({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuthStore((state)=> ({ user: state.user, setUser: state.setUser }));
  const [auth, setAuth] = useState<any>();
  const { setRegistration, registration } = useRegistrationStore();
  const { setDriver, driver } = useDriverStore();
  const router = useRouter();

  useEffect(() => {
    const unsub = listenOnAuth((usr) => {
      if (!usr) {
        router.push("/drivers/signin");
        return;
      }
      if(!user) {
        setUser({
          uid: usr.uid,
          email: usr.email || "",
          displayName: usr.displayName || "",
          phoneNumber: usr.phoneNumber || "",
          photoURL: usr.photoURL || "",
        });
      }
        console.log("I am running")
    });

    return unsub;
  }, [router]);

  useEffect(() => {
    if (!user?.uid || registration) return;
    const unsub = listenOnRegistration(user.uid, (reg) => {
      setRegistration(reg);
    });
    return unsub;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || driver) return;
    const unsub = listenOnDriver(user.uid, (driver) => {
      setDriver(driver);
    });
    return unsub;
  }, [user?.uid]);
  console.log({user, auth})
  
  if (!user) {
    return null;
  }
  return (
    <div className="flex w-screen h-screen  max-h-screen lg:pl-[258px] overflow-y-auto mt-2 relative">
      <DriverNavBar user={user} />
      <MobileNav user={user} />
      <div className="flex flex-col flex-1 pb-20 md:pb-0">
         {
            driver?.status === 'pending' ? <Alert variant="warning" className="mb-3">
               <LucideClock4 />
               <AlertTitle>Account under reiview</AlertTitle>
               <AlertDescription>We are currently reviewing your application. This will take about 48 hours. You will receive a notification once your account is verified </AlertDescription>
            </Alert> : null
         }
         {children}
      </div>
    </div>
  );
}