"use client";
import React, { FC } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import { LucideMenu, LucidePower } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/services/utils';
import { DriverUser } from '@/states/drivers';
import { menuItems } from './side-bar';
import Link from 'next/link';
import { driverLogout } from '@/services/drivers';
import { usePathname } from 'next/navigation';
type MobileNavProps = {
   user: DriverUser
}
export const MobileNav:FC<MobileNavProps> = ({user}) => {
   const path = usePathname();
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white  border bored-primary-foreground shadow">
      <div className="flex flex-row items-center px-5 py-5">

      <Sheet>
        <SheetTrigger
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <LucideMenu />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[240px] flex flex-col items-center "
        >
      <img src="images/logo.jpeg" alt="travel bro logo" className="w-[80px]" />

          <SheetHeader className="text-brand font-bold">TravelBros Admin</SheetHeader>
          <nav className="flex flex-col justiy-center px-5 py-8 w-[140px] items-center h-full">
            <p className="text-sm font-medium text-center mt-5">
              {user.displayName || "Unknown user"}
            </p>

            <div className="flex flex-col gap-5 mt-16 mb-auto mx-auto">
              {menuItems.map((item) => (
                <Link
                  href={item.path}
                  className="flex flex-row gap-3 items-center"
                >
                  {item.icon}
                  <p
                    className={`text-xs ${
                      path === item.path
                        ? "text-brand font-medium"
                        : "text-primary-foreground"
                    }`}
                  >
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>

            <Button
              size="sm"
              className="mt-auto mx-auto"
              variant="outline"
              onClick={driverLogout}
            >
              <LucidePower className="w-4 h-4 mr-2" /> Logout
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      <p className="font-bold text-sm mx-auto text-primary">TravelBros Driver</p>
      </div>

    </div>
  );
}
