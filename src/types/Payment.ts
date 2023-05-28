import { Booking, OrderInfo, ReturnTrip, SeatType } from "./Booking";

export type Payment = {
   
}

export type PaymentInfo = {
   trip: ReturnTrip;
   transactionRef: string;
   price: number;
   order: OrderInfo;
   seats: SeatType;
   booking: Booking;
   returnBooking?: Booking;
   returnSeats?: SeatType;
   status: "pending" | "verified";
 };