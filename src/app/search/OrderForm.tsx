import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input'
import { Booking, ReturnTrip, SeatInfo } from '@/types/Booking';
import React, { FC, useState } from 'react'
export type OrderInfo = {
  email: string;
   name: string;
   phone: string;
   nextOfKin: string;
   nextOfKinPhone: string;

}
type OrderFormProps = {
  onContinuetoPayment: (orderInfo: OrderInfo) => Promise<void>;
 
}
export const OrderForm: FC<OrderFormProps> = ({onContinuetoPayment }) => {
   const [order, setOrder] = useState<OrderInfo>({name: '', phone: '', nextOfKin: '', nextOfKinPhone: '', email: ''});
   const [loading, setLoading] = useState(false);
   const [errorMessages, setErrorMessages] = useState<Record<keyof OrderInfo, string>>({
    email: '',
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
      case "email":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            email: 'Your email is required',
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, email: "" });
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
      return valid;
    });

  const proceedToPayment = async () => {
    const isValid = validateAll();
    if(!isValid) return;
    console.log({isValid})
    try {
      setLoading(true);
      await onContinuetoPayment(order);
    } catch (error) {
      console.log({ error });
    } finally{
      setLoading(false);
    }
    
  }
  const onSuccessPayment = () => {

  }
  return (
    <div className="flex flex-col my-5 max-w-[342px]">
      <Input
          value={order.email}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, email: e.target.value }))
          }
          label="Email"
          placeholder="Email"
          error={errorMessages.email}
        />
      <div className="grid grid-cols-2 gap-4">
        <Input
          value={order.name}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, name: e.target.value }))
          }
          label="Full Name"
          placeholder="Full name"
          error={errorMessages.name}
        />
        <Input
          value={order.phone}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, phone: e.target.value }))
          }
          label="Phone"
          placeholder="Phone number"
          error={errorMessages.phone}

        />
        <Input
          value={order.nextOfKin}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, nextOfKin: e.target.value }))
          }
          label="Next of Kin"
          placeholder="Next of Kin"
          error={errorMessages.nextOfKin}

        />
        <Input
          value={order.nextOfKinPhone}
          buttonSize="md"
          onChange={(e) =>
            setOrder((order) => ({ ...order, nextOfKinPhone: e.target.value }))
          }
          label="Next of Kin Phone"
          placeholder="Next of Kin Phone"
          error={errorMessages.nextOfKinPhone}

        />
      </div>
      <Button onClick={proceedToPayment} size="md" variant='solid' className='my-4'>Proceed to Payment</Button>
    </div>
  );
}
