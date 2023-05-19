import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input'
import { Booking, ReturnTrip, SeatInfo } from '@/types/Booking';
import React, { FC, useState } from 'react'
type OrderInfo = {
   name: string;
   phone: string;
   nextOfKin: string;
   nextOfKinPhone: string;

}
type OrderFormProps = {
  onConfirmPayment?: (status: 'error' | 'success') => void;
  trip?: ReturnTrip;
  bookings?: Booking[];
  seats?: Record<number, SeatInfo[]>;
  returnBookings?: Booking[];
}
export const OrderForm: FC<OrderFormProps> = ({onConfirmPayment, trip, bookings, returnBookings, }) => {
   const [order, setOrder] = useState<OrderInfo>({name: '', phone: '', nextOfKin: '', nextOfKinPhone: ''});
   const [errorMessages, setErrorMessages] = useState<Record<keyof OrderInfo, string>>({
    name: '',
    phone: '',
    nextOfKin: '',
    nextOfKinPhone: '',
   })
   const validate = (field: keyof typeof order) => {
    const value = order[field];
    switch (field) {
      case "name":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            name: 'Your name is required',
          });
          return false;
        }
        setErrorMessages({
          ...errorMessages,
          name: ''
        });
        break;
      case "phone":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            phone: 'Your Phone number is required',
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, phone: "" });
        break;
      case "nextOfKin":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            nextOfKin: 'Your Next Of Kin is required',
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, nextOfKin: "" });
        break;
      case "nextOfKinPhone":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            nextOfKinPhone: 'Your Next Of Kin is required',
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, nextOfKinPhone: "" });
        break;
      default:
        return false;
        break;
    }
    return true;
  };
  const validateAll = () =>
  Object.entries(order)
    .every(([key, value]) => {
      const valid = validate(key as any);
      console.log("valid", valid, key);
      return valid;
    });

  const proceedToPayment = () => {

  }
  const onSuccessPayment = () => {

  }
  return (
    <div className="flex flex-col my-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          value={order.name}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, name: e.target.value }))
          }
          label="Full Name"
          placeholder="Full name"
        />
        <Input
          value={order.phone}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, phone: e.target.value }))
          }
          label="Phone"
          placeholder="Phone number"
        />
        <Input
          value={order.nextOfKin}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, nextOfKin: e.target.value }))
          }
          label="Next of Kin"
          placeholder="Next of Kin"
        />
        <Input
          value={order.nextOfKinPhone}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, nextOfKinPhone: e.target.value }))
          }
          label="Next of Kin Phone"
          placeholder="Next of Kin Phone"
        />
      </div>
      <Button size="md" variant='solid' className='my-4'>Proceed to Payment</Button>
    </div>
  );
}
