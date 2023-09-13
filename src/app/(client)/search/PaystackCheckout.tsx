import { Button } from '@/components/common/Button';
import { formatNumber } from '@/services/utils';
import { ReturnTrip } from '@/types/Booking';
import React, { FC } from 'react'
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';

type PaystackCheckoutProps = {
   onSuccess: () => void;
   trip: ReturnTrip;
   total: number;
   onClose: () => void;
   options: PaystackProps;
}
export const PaystackCheckout: FC<PaystackCheckoutProps> = ({ onSuccess, onClose, options, total, trip }) => {
   const initializePayment = usePaystackPayment(options)
  return (
    <div className="sm:w-full md:max-w-[512px] flex flex-col self-center my-5">
      <p className="text-xl text-slate-600 font-bold">Make Payment!</p>
      <div className="flex flex-row justify-between w-full mb-2 mt-3">
         <p className="text-xl font-bold text-slate-900">Email</p>
         <p className="text-xl font-bold text-slate-500">{options.email}</p>
      </div>
      <div className="flex flex-row justify-between w-full mb-2">
         <p className="text-xl font-bold text-slate-900">Number of Seats</p>
         <p className="text-xl font-medium text-slate-500">{trip.numberOfSeats}</p>
      </div>
      <div className="flex flex-row justify-between w-full mb-2">
         <p className="text-xl font-bold text-slate-900">Date</p>
         <p className="text-xl font-medium text-slate-500">{trip.date}</p>
      </div>
      <div className="flex flex-row justify-between w-full mb-2">
         <p className="text-xl font-bold text-slate-900">Return Date</p>
         <p className="text-xl font-medium text-slate-500">{trip.returnDate}</p>
      </div>
      <div className="flex flex-row justify-between w-full mb-2">
         <p className="text-xl font-bold text-slate-900">Vehicle Type</p>
         <p className="text-xl font-medium text-slate-500">{trip.vehicleType}</p>
      </div>
      <div className="flex flex-row justify-between w-full mb-2">
         <p className="text-xl font-bold text-slate-900">Amount Due</p>
         <p className="text-xl font-medium text-slate-500">{formatNumber(total, "NGN")}</p>
      </div>

      <Button size="md"  className='my-5' onClick={()=> initializePayment(onSuccess, onClose)} >Make Payment</Button>
    </div>
  )
}
