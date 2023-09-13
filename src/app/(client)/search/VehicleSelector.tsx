import { Button } from "@/components/common/Button";
import { sortAndGroupBookingByTime } from "@/services/search";
import { formatNumber } from "@/services/utils";
import { Booking, Destination } from "@/types/Booking";
import React, { FC, useMemo, useState } from "react";
import { BsArrowLeft, BsBack } from "react-icons/bs";
type VehicleSelectorProps = {
  bookings: Booking[];
  destination: Destination;
  numberOfSeats: number;
  isReturn?: boolean;
  onBook: (booking: Booking) => void;
  backLablel?: string;
  onBack?: () => void;
};
type BookingTableProps = {
  bookings: Booking[];
  time: string;
  onBook: (booking: Booking) => void;
  numberOfSeats: number;
  date: string;
};
const BookingTable: FC<BookingTableProps> = ({
  bookings,
  time,
  numberOfSeats,
  date,
  onBook,
}) => {
  return (
    <>
      <div className="flex md:my-3 bg-primary-light px-3 py-3">
        <p className="text-lg font-bold text-primary">
          {time}: {`${date}`}
        </p>
      </div>
      <div className="flex flex-col">
        {bookings.map((booking, i) => (
          <div
            className="flex flex-col mx-3 mb-3 md:hidden py-4 border-b-[1px] border-b-primary-light"
            key={`mobile-vehicle-${i}`}
          >
            <p className="text-base mb-5 text-black font-semibold">{`Vehicle ${
              i + 1
            }`}</p>

            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-primary">Time</p>
                <p className="text-base text-slate-600">{booking.timeString}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-primary">Availability</p>
                <p className="text-base text-slate-600">{`${booking.availableSeats} seat(s)`}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-primary">Price</p>
                <p className="text-base text-slate-600">
                  {formatNumber(booking.price, "NGN")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              title="Select Seat(s)"
              className="mt-4 self-start"
              onClick={() => onBook(booking)}
            />
          </div>
        ))}
      </div>
      <table className="border-collapse mx-5 hidden md:table">
        <thead>
          <tr>
            <td className="text-base font-bold text-primary">Vehicle</td>
            <td className="text-base font-bold text-primary">Time</td>
            <td className="text-base font-bold text-primary">Availability</td>
            <td className="text-base font-bold text-primary">Price</td>
            <td className="text-base font-bold text-primary">Action</td>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, i) => (
            <tr
              className="border-b-[1px] border-b-primary-light py-5 text-black"
              key={`${time}-${booking.id}`}
            >
              <td className="py-5">{`Vehicle ${i + 1}`}</td>
              <td>{booking.timeString}</td>
              <td>{`${booking.availableSeats} seat(s) available`}</td>
              <td>{`${formatNumber(booking.price, "NGN")} per seat`}</td>
              <td>
                {booking.availableSeats ? (
                  <Button
                    onClick={() => onBook(booking)}
                    size="sm"
                    variant="solid"
                  >
                    Select Seat(s)
                  </Button>
                ) : (
                  "Fully booked"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export const VehicleSelector: FC<VehicleSelectorProps> = ({
  bookings,
  destination,
  numberOfSeats,
  onBook,
  isReturn = false,
  backLablel,
  onBack,
}) => {
  const vehicleCategories = useMemo(() => {
    return sortAndGroupBookingByTime(bookings);
  }, [bookings]);

  return (
    <div className="flex flex-col mx-5">
      {onBack ? (
        <Button
          variant="outline"
          size="sm"
          className="w-max items-center my-5"
          onClick={onBack}
        >
          <BsArrowLeft className="mr-2" /> {backLablel || "Back"}
        </Button>
      ) : null}
      <h3 className="text-3xl my-5 font-bold text-primary">{`Select vehicles for your${
        isReturn ? " return" : ""
      } trip from ${destination.from} to ${destination.to}`}</h3>
      {Object.entries(vehicleCategories).map(([key, bookings]) => (
        <BookingTable
          numberOfSeats={numberOfSeats}
          key={`booking-${key}`}
          time={key}
          bookings={bookings}
          onBook={onBook}
          date={destination.date}
        />
      ))}
    </div>
  );
};
