import RegistrationTable from "@/components/admin/registration-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export default function Registration() {
  return (
    <div className="flex flex-col border border-bg-foreground w-full min-h-[calc(100vh-16px)] rounded-md">
      <Card>
        <CardHeader>
          <CardTitle>Drivers Registration</CardTitle>
          <CardDescription>
            Manage driver registration information,verify and approve or reject
            registration
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-5">
          <RegistrationTable />
        </CardContent>
      </Card>
    </div>
  );
}
