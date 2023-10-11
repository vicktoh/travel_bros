"use client";
import { Empty } from "@/components/drivers/empty-state";
import { VehicleRegistrationModal } from "@/components/drivers/vehicle-registration-modal";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { VehicleStatusTheme } from "@/constants";
import { listenOnMyDriverRegistration } from "@/services/drivers";
import { useAuthStore } from "@/states/drivers";
import { RegistrationInfoWithId } from "@/types/Admin";
import { format, set } from "date-fns";
import { LucideBell, LucideLoader, LucidePencil, LucidePlus } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function VehiclePage() {
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] =
    useState<RegistrationInfoWithId[]>();
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationInfoWithId>();
  const [isModalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<"add" | "edit">("add");
  
  const { user } = useAuthStore();
  const { toast } = useToast();

  const onAddNewRegistration = () =>{
    setMode("add");
    setSelectedRegistration(undefined)
    setModalOpen(true);
  }
  const onEdit = (registration: RegistrationInfoWithId) => {
    setMode("edit");
    setSelectedRegistration(registration);
    setModalOpen(true);
  }
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const unsub = listenOnMyDriverRegistration(
      user.uid,
      (regs) => {
        setLoading(false);
        console.log({ regs });
        setRegistrations(regs);
      },
      (error) => {
        toast({
          title: "Could not fetch registrations",
          description: error,
          variant: "destructive",
        });
      },
    );
    return unsub;
  }, [user?.uid, toast]);

  return (
    <div className="flex flex-col px-1 lg:px-5 w-full">
      <Card className="max-w-full">
        <CardHeader>
          <CardTitle className="text-lg">Vehicles</CardTitle>
          <CardDescription>Manage your vehicle registration</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex flex-row items-center justify-end my-5">
            <Button
              className="text-white"
              type="button"
              onClick={onAddNewRegistration}
            >
              New Vehicle <LucidePlus className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="w-full relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Model/Name</TableHead>
                  <TableHead>Manufacture Year</TableHead>
                  <TableHead>Date Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableHead colSpan={6}>
                      <div className="flex flex-col items-center justify-center h-[352px] gap-3">
                        <p className="text-sm font-medium animate-pulse">
                          Fetching vehicles
                        </p>
                        <LucideLoader className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    </TableHead>
                  </TableRow>
                ) : registrations?.length ? (
                  registrations.map((reg, i) => (
                    <TableRow key={reg.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{`${reg.vehicleInformation.yearOfManufacture} ${reg.vehicleInformation.model}`}</TableCell>
                      <TableCell>
                        {reg.vehicleInformation.yearOfManufacture}
                      </TableCell>
                      <TableCell>
                        {reg.dateCreated
                          ? format(reg.dateCreated, "dd MMM yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${VehicleStatusTheme[reg.status]}`}>
                          {reg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-3">
                          <Button onClick={() => onEdit(reg)} variant="outline" size="icon" className="border-primary-light">
                            <LucidePencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-primary-light relative"
                          >
                            {(reg.messageCount || 0) - (reg.readCount || 0) >
                            0 ? (
                              <div className="inline-flex items-center absolute -top-1 -right-1 justify-center w-2 h-2 bg-red-500 text-white text-xs rounded-full">
                                {(reg.messageCount || 0) - (reg.readCount || 0)}
                              </div>
                            ) : null}
                            <LucideBell className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableHead colSpan={6}>
                      <Empty
                        title="No Payouts"
                        description="You do not have any Payouts yet!"
                      />
                    </TableHead>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {isModalOpen && <VehicleRegistrationModal
            registration={selectedRegistration}
            isOpen={isModalOpen}
            setOpen={setModalOpen}
          />}
        </CardContent>
      </Card>
    </div>
  );
}
