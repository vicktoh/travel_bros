import { Booking, ConfirmedPassenger, ReturnTrip, SeatInfo } from "@/types/Booking";
import React, { FC, useState } from "react";
import { VehicleSelector } from "./VehicleSelector";
import { SeatSelector } from "./SeatSelector";
type Page =
  | "select-vehicle"
  | "select-seats"
  | "select-return-vehicle"
  | "select-return-seats";
type SelectFlowProps = {
  bookings: Booking[];
  returnBookings?: Booking[];
  trip: ReturnTrip;
};
type Seat = Omit<ConfirmedPassenger, "paymentRef">;
export const SelectFlow: FC<SelectFlowProps> = ({
  bookings,
  returnBookings,
  trip,
}) => {
  const [page, setPage] = useState<Page>("select-vehicle");
  const [seats, setSeats] = useState<Record<string, SeatInfo | undefined>>({});
  const [returnSeats, setReturnSeats] = useState< Record<string, SeatInfo | undefined>>({});
  const [booking, setBooking] = useState<Booking>();
  const [returnBooking, setReturnBooking] = useState<Booking>();

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
          
        />
      );
  }
};
