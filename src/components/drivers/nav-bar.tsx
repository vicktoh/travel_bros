import React, { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "firebase/auth";
import { getInitials } from "@/services/utils";
import { LucideCog, LucideCreditCard, LucideHistory, LucideHome, LucidePower, LucideUser2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { DriverUser } from "@/states/drivers";
import { driverLogout } from "@/services/drivers";
type DriverNavBarProps = {
  user: DriverUser;
};
type MenuItem = {
  title: string;
  icon: ReactNode;
  path: string;
};
export const menuItems: MenuItem[] = [
   {
      title: "Home",
      icon: <LucideHome />,
      path: "/drivers"
   },
   {
      title: "Trips",
      icon: <LucideHistory />,
      path: "/drivers/history"
   },
   {
      title: "Profile",
      icon: <LucideUser2 />,
      path: "/drivers/registration/personal"
   },
   {
      title: "Payouts",
      icon: <LucideCreditCard />,
      path: "/drivers/payouts"
   }
]
export default function DriverNavBar({ user }: DriverNavBarProps) {
   const path = usePathname()
  return (
    <nav className="flex-col hidden lg:flex px-5 py-8 border border-primary-foreground w-[240px] items-center left-2 rounded-lg fixed top-2 bottom-2">

      <img src="images/logo.jpeg" alt="travel bro logo" className="w-[80px]" />
      <p className="text-base font-bold text-brand mb-6">
        TravelBros Drivers
      </p>
      <Avatar className="w-16 h-16">
        <AvatarFallback>
          {getInitials(user?.displayName || "Unknown user")}
        </AvatarFallback>
        <AvatarImage src={user.photoURL || ""} />
      </Avatar>
      <p className="text-base font-medium text-center mt-5">
        {user.displayName || "Unknown user"}
      </p>

      <div className="flex flex-col gap-5 mt-16 mb-auto mx-auto">
         {
            menuItems.map((item) => (
               <Link href={item.path}  className="flex flex-row gap-3 items-center">
                  {item.icon}
                  <p className={`text-sm ${path === item.path ? 'text-brand font-medium': 'text-primary-foreground'}`}>{item.title}</p>
               </Link>
            ))
         }
      </div>

      <Button size="sm" className="mt-auto mx-auto" variant="outline" onClick={driverLogout}>
         <LucidePower className="w-4 h-4 mr-2" /> Logout
      </Button>
    </nav>
  );
}
