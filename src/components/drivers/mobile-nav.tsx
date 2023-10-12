"use client";
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import { LucideBell, LucideMenu, LucidePower } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/services/utils';
import { DriverUser, useAuthStore, useDriverStore } from '@/states/drivers';
import { menuItems } from './nav-bar';
import Link from 'next/link';
import { driverLogout, listenOnNotifications } from '@/services/drivers';
import { usePathname } from 'next/navigation';
import { NotificationWithId } from '@/types/System';
import { useToast } from '../ui/use-toast';
import { Empty } from './empty-state';
import { NotificationComponent } from '../common/notification';
import { Badge } from '../ui/badge';
type MobileNavProps = {
   user: DriverUser
}

export const MobileNav:FC<MobileNavProps> = ({user}) => {
   const path = usePathname();
   const [notifications, setNotifications] = useState<NotificationWithId[]>();
   const unreadCount = useMemo(()=> {
   return (notifications|| []).filter(({read}) => read === false).length
   }, [notifications])
   const [loading, setLoading] = useState(false);
   const {toast} = useToast()
   useEffect(()=> {
    if(!user.uid) return;
    setLoading(true);
    const unsub = listenOnNotifications(user.uid, (nots)=> {
      setLoading(false);
      setNotifications(nots);
    }, (error) => {
      setLoading(false);
      toast({
        title: "Could not fetch Notifications",
        description: error,
        variant: 'destructive'
      });
    })
    return unsub;
   }, [user.uid])
  return (
    <div className="md:left-[266px] md:top-2 rounded-md fixed top-0 left-0 right-0 z-10 bg-white  border border-primary-foreground">
      <div className="flex flex-row items-center px-5 py-5">
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "md:hidden",
            )}
          >
            <LucideMenu />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] flex flex-col items-center "
          >
            <img
              src="images/logo.jpeg"
              alt="travel bro logo"
              className="w-[80px]"
            />

            <SheetHeader className="text-brand font-bold">
              TravelBros Driver
            </SheetHeader>
            <nav className="flex flex-col justiy-center px-5 py-8 w-[140px] items-center h-full">
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {getInitials(user?.displayName || "Unknown user")}
                </AvatarFallback>
                <AvatarImage src={user.photoURL || ""} />
              </Avatar>
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
        <p className="font-bold text-sm mx-auto text-primary">
          TravelBros Driver
        </p>
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "border border-primary-light relative",
            )}
          >
            <LucideBell className="w-4 h-4" />
            {unreadCount ? (
              <div className="w-3 h-3 rounded-full bg-red-500 inline-flex justify-center p-2 text-[10px] items-center text-justify text-white absolute right-0 top-0">
                {unreadCount}
              </div>
            ): null}
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[320px] flex flex-col items-center "
          >
            <SheetHeader className="text-brand font-bold">
              Notifications
            </SheetHeader>
            <nav className="flex flex-col justiy-center px-5 py-8 w-[3200px] items-center h-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[500px]"></div>
              ) : notifications?.length ? (
                notifications.map((not) => (
                  <NotificationComponent key={not.id} notification={not} />
                ))
              ) : (
                <div className="flex flex-col justify-center items-center px-2 border border-primary-light p-5 ">
                  <img src="/images/full-inbox-0.png" className="w-[200px]" />
                  <p className="text-lg font-bold text-primary text-center">
                    Empty Notificaitons
                  </p>
                  <p className="text-sm font-medium text-slate-400 mx-5">
                    You do not have any notifications yet!
                  </p>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
