"use client";
import { Loading } from "@/components/common/Loading";
import { getBooking, listenOnRef, rescheduleBooking } from "@/services/bookings";
import { PaymentInfo } from "@/services/search";
import { Booking, BookingChange, SeatInfo, SeatType } from "@/types/Booking";
import { differenceInDays, isBefore, isSameDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { BsCalendar, BsCheckCircle, BsCheckCircleFill, BsClock } from "react-icons/bs";
import { VehicleSelector } from "../search/VehicleSelector";
import { AvailableVehicles } from "./AvailableVehicles";
import { VehicleWithID } from "@/types/Vehicle";
import { SeatSelector } from "../search/SeatSelector";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { ManageBookingForm } from "@/components/ManageBookingForm";
import Image from "next/image";
type BookingStatus = "ongoing" | "upcoming" | "completed";
type BookingComponentProps = {
  booking: Booking;
  onSetReschedule: (date: string) => void;
};
const StatusIcon: Record<BookingStatus, ReactNode> = {
  completed: <BsCheckCircleFill className="text-green-700" />,
  ongoing: <BsClock className="text-orange-500" />,
  upcoming: <BsCalendar className="text-green-700" />,
};
const BookingComponent: FC<BookingComponentProps> = ({
  booking,
  onSetReschedule,
}) => {
  const [rescheduldDate, setRescheduleDate] = useState("");
  const status: BookingStatus = useMemo(() => {
    if (isSameDay(new Date(booking.date), new Date())) {
      return "ongoing";
    }
    if (isBefore(new Date(), new Date(booking.date))) {
      return "upcoming";
    }
    return "completed";
  }, [booking.date]);
  return (
    <>
      <table className="hidden md:table border-collapse px-3 mx-5 ">
        <thead>
          <tr>
            <th className="text-left font-bold text-sm text-primary">Vehicle Type</th>
            <th className="text-left font-bold text-sm text-primary">Route</th>
            <th className="text-left font-bold text-sm text-primary">Date and Time</th>
            <th className="text-left font-bold text-sm text-primary">Status</th>
            <th className="text-left font-bold text-sm text-primary">Action</th>
          </tr>
        </thead>
        <tbody>
          {booking ? (
            <tr className="text-left text-base text-slate-600 py-5 border-b-[1px] border-primary-light">
              <td className="py-5">{booking.vehicleType || "Prestige"}</td>
              <td>
                {booking.from} to {booking.to}
              </td>
              <td>{booking.date}</td>
              <td>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-base text-black">{status || "Unknown"}</p>
                  {status && StatusIcon[status]}
                </div>
              </td>
              <td>
                <div className="flex flex-row gap-2 items-center">
                  {status === "upcoming" &&
                  new Date().getTime() < new Date(booking.date).getTime() ? (
                    <div className="flex flex-row gap-3 items-center">
                      <Input
                        type="date"
                        value={rescheduldDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        placeholder="Select a new Date"
                        buttonSize="sm"
                      />
                      <Button
                        title="Reschedule"
                        onClick={() => onSetReschedule(rescheduldDate)}
                        size="sm"
                      />
                    </div>
                  ) : (
                    StatusIcon[status]
                  )}
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <div className="flex flex-col px-5 py-5 border-b-[1px] border-b-primary-light md:hidden">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-base text-black">{booking.vehicleType}</p>
          <p className="text-base text-slate-600 font-bold">{booking.date}</p>
        </div>
        <div className="flex flex-row mt-5 justify-between">
          <div className="flex flex-col gap1 items-start">
            <p className="text-sm font-bold text-primary">Status</p>
            <div className="flex flex-row items-cent justify-start gap-3">
              <p className="text-base text-slate-600 font-bold">{status}</p>
              {StatusIcon[status]}
            </div>
          </div>
          <div className="flex flex-col gap1 items-start">
            <p className="text-sm font-bold text-primary">Route</p>
            <p className="text-base text-slate-600 font-bold">{`${booking.from} to ${booking.to}`}</p>
          </div>
          <div className="flex flex-col gap1 items-start">
            <p className="text-sm font-bold text-primary">Time</p>
            <p className="text-base text-slate-600 font-bold ">
              {booking.timeString}
            </p>
          </div>
         
        </div>
        {
            status === "upcoming" &&
            new Date().getTime() < new Date(booking.date).getTime()? (
              <div className="flex flex-col gap-3 items-start mt-10">
                <Input
                  label="Reschedule Date"
                  type="date"
                  value={rescheduldDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  placeholder="Select a new Date"
                  buttonSize="sm"
                  className="max-w-max"
                />
                <Button
                  title="Reschedule"
                  onClick={() => onSetReschedule(rescheduldDate)}
                  size="sm"
                />
              </div>
            ) : (
              StatusIcon[status]
            )  
          }
      </div>
    </>
  );
};
type Page = "ref" | "vehicle-selector" | "seat-selector" | "success";
type BookingManagerProps = {
  vehicles: VehicleWithID[];
};
export const BookingManager: FC<BookingManagerProps> = ({ vehicles }) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();
  const [page, setPage] = useState<Page>("ref");
  const [showError, setShowError] = useState('');
  const [loadingText, setLoadingText] = useState<string>('Fetching booking...');
  const [rescheduleDate, setRescheduleDate] = useState<string>();
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const [newBooking, setNewBooking] = useState<Booking>();
  const [newSeats, setNewSeats] = useState<SeatType>({});
  const router = useRouter();
  const params = useSearchParams();
  const onReschdule = (date: string) => {
    setRescheduleDate(date);
    setPage("vehicle-selector");
  };
  const onBookingAgain = (ref: string) => {
   const urlSearchParm = new URLSearchParams()
   urlSearchParm.set("ref", ref);
   router.replace(`/bookings?${urlSearchParm.toString()}`);
  }

  const onFinalReschedule = async () => {
    if(!newBooking || !newSeats || !paymentInfo){
      console.log("missing arguments");
      return;
    }
    const bookingChange: BookingChange = { 
      booking: paymentInfo.booking,
      newBooking,
      newSeat: newSeats,
      oldSeats: paymentInfo.seats,
      ref: paymentInfo.transactionRef,
    }
    
    try {
      setLoadingText('Rescheduling booking');
      const response = await rescheduleBooking(bookingChange);
      if(response.data.status === 200) {
        setRescheduleDate("");
        setPage("success");
      }
      if(response.data.status === 400){
        setShowError('Unable to reschedule booking');
      }
    } catch (error) {
      setShowError('Unable to reschedule booking');
      
    } finally {
      setLoadingText('');
    }
    
  };
  const renderRefPage = () => {
    return (
      <>
        <div className="flex-col py-3 px-2">
          {`Booking Ref: ${params.get("ref")}`}
        </div>

        {paymentInfo?.booking && (
          <BookingComponent
            booking={paymentInfo?.booking}
            onSetReschedule={onReschdule}
          />
        )}
        {paymentInfo?.returnBooking && (
          <BookingComponent
            booking={paymentInfo?.returnBooking}
            onSetReschedule={onReschdule}
          />
        )}
      </>
    );
  };
  const onBook = (booking: Booking) => {
    setNewBooking(booking);
    setPage("seat-selector");
  };
  const onSuccess = () => {
    setPage("ref");
  }
  const renderPage = () => {
    switch (page) {
      case "ref":
        return renderRefPage();
      case "vehicle-selector":
        if (!(rescheduleDate && paymentInfo?.trip)) return;
        return (
          <AvailableVehicles
            onBook={onBook}
            trip={{ ...(paymentInfo?.trip || {}) }}
            date={rescheduleDate}
            vehicles={vehicles}
          />
        );
      case "seat-selector":
        if (!(newBooking && paymentInfo?.trip)) return;
        return (
          <SeatSelector
            booking={newBooking}
            numberOfSeats={paymentInfo?.trip.numberOfSeats}
            selectedSeats={newSeats}
            setSelectedSeats={setNewSeats}
            trip={paymentInfo.trip}
            vehicleNumberOfSeats={5}
            onContinue={onFinalReschedule}
          />
        );
      case "success":
        return (
          <div className="flex flex-col items-center bg-white p-5">
            <Image
              src="/images/traveler.svg"
              className="mt-8 mb-5"
              alt="Success"
              width={300}
              height={300}
            />
            <p className="text-base font-medium text-primary">{`You have successfully rescheduled your trip mt-3 mb-5`}</p>

            <Button onClick={onSuccess} className="" size="sm" variant="outline">
              Finish
            </Button>
          </div>
        );
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoadingText('Fetching booking information');
        const ref = params.get("ref");
        if (!ref) return;
        const unsub =  listenOnRef(ref, (paymentInfo) => {
          if (paymentInfo ===false) return;
          setPaymentInfo(paymentInfo);
        });
        const paymentInfo = await getBooking(ref);
        console.log(paymentInfo)
        if (paymentInfo === false) {
          setShowError(`There are no bookings available for this reference code ${ref}`);
          return;
        }
        setPaymentInfo(paymentInfo);
      } catch (error) {
        setShowError('Could not fetch booking information');
        console.error(error);
      } finally {
        setLoadingText('');
      }
    };
    fetchBooking();
  }, [params]);

  useEffect(()=>{
    const ref = params.get('ref');
    if(!ref) return;
    const unsub = listenOnRef(ref, (paymentInfo) => {
      if (paymentInfo ===false) return;
      setPaymentInfo(paymentInfo);
    });
    return unsub;
  },[params]);
  console.log({showError});
  if (!!loadingText) {
    return (
      <div className="flex flex-col bg-white items-center justify-center">
         <Loading  title={loadingText}/>
      </div>
    );
  }
  if (!!showError) {
    return (
      <div className="flex flex-col px-3 py-5 justify-center items-center h-[50vh]">
        <p className="text-red-500 text-lg font-bold">Something went wrong</p>
        <p className="text-base font-semibold text-slate-600">{showError}</p>
        <ManageBookingForm onSubmitRef={onBookingAgain} />
      </div>
    );
  }
  return <div className="flex flex-col mt-5">
   {renderPage()}
  </div>;
};
