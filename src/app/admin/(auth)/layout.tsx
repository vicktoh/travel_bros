"use client";

import { MobileNav } from "@/components/admin/mobile-nav";
import AdminSideBar from "@/components/admin/side-bar";
import { listenOnAuth } from "@/services/admin";
import {
  useAuthStore,
} from "@/states/drivers";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

export default function AdminClient({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuthStore((state)=> ({ user: state.user, setUser: state.setUser }));
  const router = useRouter();

  useEffect(() => {
    const unsub = listenOnAuth((usr) => {
      if (!usr) {
        router.push("/admin/signin");
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
    });

    return unsub;
  }, [router]);



  
  if (!user) {
    return null;
  }
  return (
    <div className="flex h-screen  max-h-screen lg:pl-[258px] mt-2 relative overflow-hidden">
      <AdminSideBar user={user} />
      <MobileNav user={user} />
      <div className="w-full md:w-auto flex flex-col flex-1 pt-24 md:pt-0  md:pb-0">
         {children}
      </div>
    </div>
  );
}
