"use client";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { getAvailableVehicles } from "@/services/search";
import { Booking, ReturnTrip } from "@/types/Booking";
import { VehicleWithID } from "@/types/Vehicle";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { VehicleSelector } from "../search/VehicleSelector";
type AvailableVehiclesProps = {
  vehicles: VehicleWithID[];
  trip: ReturnTrip;
  date?: string;
  onBook: (book: Booking) => void;
};

export const AvailableVehicles: FC<AvailableVehiclesProps> = ({
  vehicles,
  trip,
  date,
  onBook,
}) => {
  const [fetching, setFetching] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchAvaliableVehilce = useCallback(async () => {
    try {
      setFetching(true);
      const bookings = await getAvailableVehicles(
        {
          to: trip.to,
          from: trip.from,
          date: date || trip.date,
        },
        vehicles,
        Number(trip.numberOfSeats),
      );
      setBookings(bookings || []);
    } catch (error) {
    } finally {
      setFetching(false);
    }
  }, [trip, vehicles]);
  useEffect(() => {
    fetchAvaliableVehilce();
  }, [fetchAvaliableVehilce]);

  if (fetching) {
   
    return (
      <div className="flex flex-col bg-white">
         <Loading title="Fetching available vehicles" />;
      </div>
    )
  }

  return bookings?.length ? (
    <VehicleSelector
      onBook={onBook}
      bookings={bookings}
      destination={{ to: trip.to, from: trip.from, date: trip.date }}
      numberOfSeats={trip.numberOfSeats}
    />
  ) : (
   <div className="flex flex-col bg-white">
      <p className="text-base font-semibold text-primary" >No available vehicles</p>
   </div>
  );
};
