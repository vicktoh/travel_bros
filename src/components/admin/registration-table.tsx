'use client';
import { listenOnRegistration } from '@/services/admin';
import { RegistrationInfoWithId } from '@/types/Admin';
import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast';
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LucideLoader2 } from 'lucide-react';
import { format } from 'date-fns';
import { InfoStatus } from '@/types/Driver';
import { Empty } from '../drivers/empty-state';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { RegistrationOverView } from './registration-view';
import { DriverInfoModal } from './driver-modal';
const STATUS_COLORS: Record<InfoStatus, {title: string, className: string}> = {
   "complete": {
      title: "not submitted",
      className: "bg-blue-500 text-white",
   },
   "pending": {
      title: "awaiting approval",
      className: "bg-yellow-500 text-black",
   },
   "empty": {
      title: "empty",
      className: "bg-gray-500 text-white",
   },
   "rejected": {
      title: "rejected",
      className: "bg-red-500 text-white",
   }
}
export default function RegistrationTable() {
   const [registrations, setRegistrations] = useState<RegistrationInfoWithId[]>();
   const [loading, setLoading] = useState(false);
   const [selectedReg, setSelectedReg] = useState<RegistrationInfoWithId>();
   const [isModalOpen, setModalOpen] = useState(false);
   const [isContactModalOpen, setContactModalOpen] = useState(false);

   const onViewRegistration = (registration: RegistrationInfoWithId) => {
      setSelectedReg(registration);
      setModalOpen(true);
   }
   const onViewRegContact = (registration: RegistrationInfoWithId)=> {
    setSelectedReg(registration);
    setContactModalOpen(true);
   }
   const {toast} = useToast();
   useEffect(()=> {
      try {
         const unsub = listenOnRegistration((regs) => {
            setLoading(false);
            setRegistrations(regs);
         })

         return;
         
      } catch (error) {
         const err: any = error;
         toast({
            title: "Could not fetch registrations",
            description: err?.messgae || "Unknown error occurred",
         });
         setLoading(false);
      }
   }, []);
  return (
    <>
      <Table>
        <TableCaption>Driver Registration Info</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Car Brand</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action Button</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col justify-center items-center w-full h-[256px]">
                  <LucideLoader2 className="animate-spin w-8 h-8 text-primary" />
                  <p className="text-primary">Fetching Registrations</p>
                </div>
              </TableCell>
            </TableRow>
          ) : registrations?.length ? (
            registrations.map((reg) => (
              <TableRow>
                {/* <TableCell>{reg.fullname}</TableCell> */}
                <TableCell>
                  {reg.vehicleInformation
                    ? `${reg.vehicleInformation.yearOfManufacture} ${reg.vehicleInformation.model}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {reg.dateCreated && format(reg.dateCreated, "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  {reg.status && (
                    <Badge className={`${STATUS_COLORS[reg.status].className}`}>
                      Awaiting Approval
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border border-primary-light"
                    type="button"
                    onClick={() => onViewRegistration(reg)}
                  >
                    View Info
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border border-primary-light ml-2"
                    type="button"
                    onClick={() => onViewRegContact(reg)}
                  >
                    Contact Info
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Empty title="There are no registrations available yet." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-full max-w-[800px] h-screen overflow-x-hidden">
          <DialogHeader className="sticky top-0 bg-white">
            <DialogTitle>Driver Registration Info</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedReg && <RegistrationOverView reg={selectedReg} />}
        </DialogContent>
      </Dialog>
      {selectedReg?.userId && (
        <DriverInfoModal
          driverId={selectedReg.userId}
          isOpen={isContactModalOpen}
          setOpen={setContactModalOpen}
        />
      )}
    </>
  );
}
