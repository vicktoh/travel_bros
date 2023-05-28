import { Booking, ConfirmedPassenger, OrderInfo, ReturnTrip, SeatInfo } from "@/types/Booking";
import React, { FC, useMemo, useState } from "react";
import { VehicleSelector } from "./VehicleSelector";
import { SeatSelector } from "./SeatSelector";
import { PaystackCheckout } from "./PaystackCheckout";
import { PaystackProps } from "react-paystack/dist/types";
import { PaymentInfo, getPaymentRef, storePaymentRef } from "@/services/search";
import { Success } from "./Success";

export type Page =
  | "select-vehicle"
  | "select-seats"
  | "select-return-vehicle"
  | "select-return-seats"
  | "Payment"
  | "success"
  | "fail"
type SelectFlowProps = {
  bookings: Booking[];
  returnBookings?: Booking[];
  trip: ReturnTrip;
  page: Page,
  setPage: (page: Page) => void;
};
type Seat = Omit<ConfirmedPassenger, "paymentRef">;
export const SelectFlow: FC<SelectFlowProps> = ({
  bookings,
  returnBookings,
  trip,
  page,
  setPage,
}) => {
  const [seats, setSeats] = useState<Record<string, SeatInfo | undefined>>({});
  const [returnSeats, setReturnSeats] = useState< Record<string, SeatInfo | undefined>>({});
  const [booking, setBooking] = useState<Booking>();
  const [returnBooking, setReturnBooking] = useState<Booking>();
  const [payStackOption, setPaystackOption] = useState<PaystackProps>({publicKey: '', amount: 0, email: ''});
  const total = useMemo(()=> {
    return (booking?.price || 0) * trip.numberOfSeats * (trip.returnTrip ? 2 : 1)
  }, [booking?.price, trip.numberOfSeats, trip.returnTrip])
  const onBook = (booking: Booking) => {
    setBooking(booking);
    setPage("select-seats");
  };
  const onBookReturn = (booking: Booking) => {
    setReturnBooking(booking);
    setPage("select-return-seats");
  };
  const onContinueToReturnVehicles = ()=> {
    setPage('select-return-vehicle');
  }
  const onBackFromSeatSelect = ()=> {
    setSeats({});
    setPage('select-vehicle');
  }
  const onBackFromReturnVehicle = ()=> {
    setPage('select-seats');
  }
  const onBackFromReturnSeats = ()=> {
    setReturnSeats({});
    setPage('select-return-vehicle');
  }
  const onGotoPayment = async (order: OrderInfo) => {
    
    if(!booking) return;
    const paymentRef = await getPaymentRef();
    const paystackOption: PaystackProps = {
      amount: total * 100,
      email: order.email,
      publicKey: process.env.NEXT_PUBLIC_PAY_STACK_KEY!,
      reference: paymentRef,
      firstname: order.name,
      phone: order.phone, 
    }
    const paymentInfo: PaymentInfo = {
      booking,
      order,
      price: total,
      transactionRef: paymentRef,
      trip: trip,
      ...(returnBooking ? {returnBooking}: {}),
      ...(returnSeats && returnBooking ? { returnSeats}: {}),
      seats,
      status: 'pending',

    }
    console.log(paymentInfo)
    await storePaymentRef(paymentInfo);
    setPaystackOption(paystackOption);
    setPage('Payment');
  }
  const onClosePayment = ()=> {

  }
  const onSuccess = ()=> {
    setSeats({});
    setReturnSeats({});
    setBooking(undefined);
    setReturnBooking(undefined);
    setPage('success');
  }  
  switch (page) {
    case "select-vehicle":
      return (
        <VehicleSelector
          onBook={onBook}
          numberOfSeats={1}
          bookings={bookings}
          destination={{ to: trip.to, from: trip.from, date: trip.date }}
        />
      );
    case "select-seats":
      if (!booking) return null;
      return (
        <SeatSelector
          numberOfSeats={trip.numberOfSeats}
          selectedSeats={seats}
          setSelectedSeats={setSeats}
          booking={booking}
          onContinue={onContinueToReturnVehicles}
          vehicleNumberOfSeats={5}
          trip={trip}
          showPayment={!trip.returnTrip}
          onBack={onBackFromSeatSelect}
          backLablel="Back to vehicle"
          onContinuetoPayment={onGotoPayment}
        />
      );
    case "select-return-vehicle":
      if(returnBookings)
      return (
        <VehicleSelector
          onBook={onBookReturn}
          numberOfSeats={3}
          bookings={returnBookings}
          destination={{ from: trip.to, to: trip.from, date: trip.returnDate }}
          isReturn={true}
          backLablel="Back to seats select"
          onBack={onBackFromReturnVehicle}
        />
      );
      return null
    case "select-return-seats":
      if (!returnBooking) return null;
      return (
        <SeatSelector
          selectedSeats={returnSeats}
          setSelectedSeats={setReturnSeats}
          numberOfSeats={trip.numberOfSeats}
          booking={returnBooking}
          vehicleNumberOfSeats={5}
          trip={trip}
          showPayment={true}
          isReturn={true}
          previousSelectedSeats={seats}
          onBack={onBackFromReturnSeats}
          backLablel="Back to vehicle select"
          onContinuetoPayment={onGotoPayment}
          
        />
      );
      case "Payment":
        if(!payStackOption) return null;
        return <PaystackCheckout options={payStackOption} trip={trip} total={total} onClose={onClosePayment} onSuccess={onSuccess}/>
      case "success":
        if(!payStackOption || !payStackOption.reference) return null;
        return <Success paymentRef={payStackOption.reference} />
       default: 
      return null
  }
};
