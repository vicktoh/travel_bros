"use client";
import RegistrationAlert from "@/components/drivers/registration-alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { listenOnRegistration } from "@/services/drivers";
import {
  useAuthStore,
  useDriverStore,
  useRegistrationStore,
} from "@/states/drivers";
import {
  LucideCarFront,
  LucideContact,
  LucideCreditCard,
  LucideIcon,
  LucideUserSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type RegistrationMenuItem = {
  title: string;
  icon: ReactNode;
  path: string;
};

const menuItems: RegistrationMenuItem[] = [
  {
    title: "Personal Info",
    icon: <LucideUserSquare className="w-4 h-4 mr-1" />,
    path: "personal",
  },
  {
    title: "Contact Info",
    icon: <LucideContact className="w-4 h-4 mr-1" />,
    path: "contact",
  },
];
export default function RegistrationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currpath = usePathname().split("/").pop();
  const { driver } = useDriverStore();
  return (
    <>
    {!driver?.status || driver.status === "onboarded" ? (
        <RegistrationAlert />
      ) : null}
    <Card className="flex  flex-col w-full relative">
      
      <CardHeader>
        <CardTitle>Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] mt-6">
          <nav className="hidden md:flex md:flex-col items-start gap-5 pr-5">
            {menuItems.map(({ icon, path, title }, i) => (
              <Link
                key={`lg-reg-link-${i}`}
                href={`drivers/registration/${path}`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  currpath === path
                    ? "text-brand font-bold bg-muted"
                    : "font-normal",
                )}
              >
                {icon}
                {title}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col">
            <div className="lg:hidden flex items-center mx-auto my-2">
              {menuItems.map(({ title, path }, i) => (
                <Link
                  href={`drivers/registration/${path}`}
                  key={`item-${i}`}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    currpath === path
                      ? "text-brand text-sm font-bold"
                      : "font-normal",
                  )}
                >
                  {title}
                </Link>
              ))}
            </div>
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
