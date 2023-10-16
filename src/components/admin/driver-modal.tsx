import React, { FunctionComponent, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Driver } from '@/types/Driver';
import { getDocument } from '@/services/drivers';
import { useToast } from '../ui/use-toast';
import { format } from 'date-fns';
import { getInitials } from '@/services/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
type DriverInfoModalProps = {
   driverId: string;
   isOpen: boolean;
   setOpen: (value: boolean) => void;
}
export const DriverInfoModal: FunctionComponent<DriverInfoModalProps> = ({ driverId, isOpen, setOpen}) => {
   const [driverInfo, setDriverInfo] = useState<Driver>();
   const {toast} = useToast();
   useEffect(()=> {
      const fetchDriverInfo = async() => {
         if(!driverId) return;
         const path= `drivers/${driverId}`;
         try {
            const snap = await getDocument(path);
            setDriverInfo(snap.data() as Driver);
            
         } catch (error) {
            const err: any = error;
            toast({title: "Error fetching driver info", description: err?.message || "Unknown", variant: "destructive" })
         }
      }
      fetchDriverInfo();

   }, [driverId])
  return (
   <Dialog open={isOpen} onOpenChange={setOpen}>
   <DialogContent  className="w-full max-w-[800px] h-screen overflow-x-hidden">
     <DialogHeader className='sticky top-0 bg-white'>
       <DialogTitle>Driver Contact Info</DialogTitle>
       <DialogDescription></DialogDescription>
     </DialogHeader>
     {
      driverInfo && 
       (
         <>
         <div className="flex items-start gap-2 mb-5">
        <Avatar className="w-16 h-16 mb-2">
          <AvatarFallback>{getInitials(driverInfo.fullname)}</AvatarFallback>
          <AvatarImage src={driverInfo.photoURL} />
        </Avatar>
      </div>

      <p className="text-base font-bold">Contact Information</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 my-3">
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Fullname</p>
            <p className="text-base">{driverInfo.fullname}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Email</p>
            <p className="text-base">{driverInfo.email}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Date of Birth</p>
            <p className="text-base">{driverInfo.dateOfBirth && format(driverInfo.dateOfBirth, "ddd MMM yyyy")}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Phone Number</p>
            <p className="text-base">{driverInfo?.contact?.phoneNumber}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">City</p>
            <p className="text-base">{driverInfo?.contact?.city}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">State</p>
            <p className="text-base">{driverInfo.contact?.state}</p>
         </div>
         <div className="flex flex-col col-span-2 md:col-span-3">
            <p className="text-sm font-bold text-slate-500">Address</p>
            <p className="text-base">{driverInfo.contact?.address}</p>
         </div>
      </div>
      <p className="text-base font-bold">Next of Kin Contact Information</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 my-3">
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Fullname</p>
            <p className="text-base">{driverInfo.nextOfKinContact?.name}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Phone Number</p>
            <p className="text-base">{driverInfo.nextOfKinContact?.phoneNumber}</p>
         </div>
         <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-500">Relationship</p>
            <p className="text-base">{driverInfo.nextOfKinContact?.relationship}</p>
         </div>
         
         <div className="flex flex-col col-span-2 md:col-span-3">
            <p className="text-sm font-bold text-slate-500">Address</p>
            <p className="text-base">{driverInfo.contact?.address}</p>
         </div>
        

      </div>
         </>
      )
     }
   </DialogContent>
 </Dialog>
  )
}
