import React, { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "firebase/auth";
import { getInitials } from "@/services/utils";
import {
  LucideCarFront,
  LucideCog,
  LucideCreditCard,
  LucideHistory,
  LucideHome,
  LucidePower,
  LucideUser2,
  LucideUserCheck,
} from "lucide-react";
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
    path: "/admin",
  },
  {
    title: "Registration",
    icon: <LucideUserCheck />,
    path: "/admin/registration",
  },
  {
    title: "Trips",
    icon: <LucideCarFront />,
    path: "/admin/trips",
  },
  {
    title: "Payouts",
    icon: <LucideCreditCard />,
    path: "/admin/payouts",
  },
];
export default function AdminSideBar({ user }: DriverNavBarProps) {
  const path = usePathname();
  return (
    <nav className="flex-col hidden lg:flex px-5 py-8 border border-primary-foreground w-[240px] items-center left-2 rounded-lg fixed top-2 bottom-2">
      <img src="images/logo.jpeg" alt="travel bro logo" className="w-[80px]" />
      <p className="text-base font-bold text-brand mb-6">TravelBros Admin</p>
      <p className="text-base font-medium text-center mt-5">
        {user.displayName || "Unknown user"}
      </p>

      <div className="flex flex-col gap-5 mt-16 mb-auto mx-auto">
        {menuItems.map((item) => (
          <Link href={item.path} className="flex flex-row gap-3 items-center">
            {item.icon}
            <p
              className={`text-sm ${
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
  );
}
