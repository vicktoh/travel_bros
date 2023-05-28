import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { SelectInput } from "@/components/common/SelectInput";
import { formatNumber } from "@/services/utils";
import { Booking, OrderInfo, ReturnTrip, SeatInfo } from "@/types/Booking";
import { Popover } from "@headlessui/react";
import React, { FC, useMemo, useState } from "react";
import { BsArrowLeft, BsPersonFill, BsPersonFillX } from "react-icons/bs";
import { GiCancel, GiSteeringWheel } from "react-icons/gi";
import { SelectedSeatsTable } from "./SelectedSeatsTable";
import { OrderForm } from "./OrderForm";

type SeatSelectorProps = {
  vehicleNumberOfSeats: number;
  numberOfSeats: number;
  booking: Booking;
  trip: ReturnTrip;
  selectedSeats: Record<string, SeatInfo | undefined>;
  setSelectedSeats: (seats: Record<string, SeatInfo | undefined>) => void;
  previousSelectedSeats?: Record<string, SeatInfo | undefined>;
  showPayment?: boolean;
  onContinuetoPayment?: (order: OrderInfo) => Promise<void>;
  onContinue?: () => void;
  isReturn?: boolean;
  backLablel?: string;
  onBack?: () => void;
};
type SeatsProps = {
  numberOfSeats: number;
  passengers: number[];
  numberOfSeatsToSelect: number;
  selectedSeats: Record<string, SeatInfo | undefined>;
  setSelectedSeats: (seats: Record<string, SeatInfo | undefined>) => void;
};
type SeatProps = {
  seat: number;
  available: boolean;
  selected: boolean;
  onSelectSeat: (info: SeatInfo, seat: number) => void;
  unSelectSeat: () => void;
  selectedInfo: SeatInfo | undefined;
  canSelect: boolean;
};
type SeatFormProps = {
  onSubmit: (info: SeatInfo) => void;
  seatInfo?: SeatInfo;
};
export const SeatForm: FC<SeatFormProps> = ({ onSubmit, seatInfo }) => {
  const [name, setName] = useState<string>(seatInfo?.name || "");
  const [gender, setGender] = useState<"male" | "female">(
    seatInfo?.gender || "female",
  );
  const [error, setError] = useState<Record<"name" | "gender", string>>({
    name: "",
    gender: "",
  });
  const validate = () => {
    if (!name) {
      console.log("hello I am running");
      setError((error) => ({ ...error, name: "Name field cannot be empty" }));
    } else {
      setError((error) => ({ ...error, name: "" }));
    }
    if (!gender) {
      setError((error) => ({ ...error, gender: "Please select a gender" }));
    } else {
      setError((error) => ({ ...error, gender: "" }));
    }
    return !!name && !!gender;
  };
  const onSelect = () => {
    const isValid = validate();
    if (!isValid) return;
    onSubmit({ name, gender });
  };
  return (
    <div className="flex flex-col py-2 px-5">
      <Input
        error={error.name}
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe."
        containerClassName="mb-3"
      />
      <SelectInput
        error={error.gender}
        options={["male", "female"]}
        label="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value as any)}
        placeholder="John Doe."
        containerClassName="mb-3"
      />

      <Button size="sm" onClick={onSelect} variant="solid">
        Select
      </Button>
    </div>
  );
};

const Seat: FC<SeatProps> = ({
  seat,
  available,
  selected,
  onSelectSeat,
  selectedInfo,
  unSelectSeat,
  canSelect,
}) => {
  return (
    <Popover className="relative mx-auto w-40 h-36">
      {({ close }) => (
        <>
          <Popover.Button className="w-full h-full">
            <div
              className={`flex w-full h-full flex-col rounded-lg items-center justify-center px-5 py-2 ${
                selected ? "bg-primary-light" : "border-[1px]"
              } `}
            >
              <h3 className="text-xl font-bold text-black ">{seat}</h3>
              {available ? (
                <BsPersonFill className="text-green-500 text-3xl" />
              ) : (
                <BsPersonFillX className="text-red-500 text-3xl" />
              )}
              {available ? (
                <>
                  <p className="text-lg font-bold text-green-600">
                    {selected ? "Selected" : "Available"}
                  </p>
                  {selectedInfo && (
                    <div className="flex flex-row gap-3 items-center py-2">
                      <p className="text-sm text-green-500">
                        {selectedInfo.name}
                      </p>
                      <button
                        onClick={unSelectSeat}
                        className="bg-white border-none flex-col justify-center items-center rounded-md"
                      >
                        <GiCancel className="text-red-500" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-lg font-bold text-red-500">Taken</p>
              )}
            </div>
          </Popover.Button>
          {available && (selected || canSelect) ? (
            <Popover.Panel
              className={`absolute left-0 ${
                seat % 2 == 1 ? "-translate-x-[35%]" : ""
              } md:translate-x-1  top-0 -translate-y-[70%] z-10
               bg-white shadow-lg rounded-lg border-[1px] border-primary-light py-3`}
            >
              <SeatForm
                onSubmit={(info) => {
                  onSelectSeat(info, seat);
                  close();
                }}
                seatInfo={selectedInfo}
              />
            </Popover.Panel>
          ) : null}
        </>
      )}
    </Popover>
  );
};

const Seats: FC<SeatsProps> = ({
  numberOfSeats,
  passengers,
  numberOfSeatsToSelect,
  selectedSeats,
  setSelectedSeats,
}) => {
  const aggregateSeats = useMemo(() => {
    const seats: Omit<SeatProps, "onSelectSeat">[] = [];
    for (let i = 1; i <= numberOfSeats; i++) {
      let seat: Omit<SeatProps, "onSelectSeat"> = {
        seat: i,
        available: !passengers.includes(i),
        selected: !!selectedSeats[i],
        selectedInfo: selectedSeats[i],
        unSelectSeat: () => unSelectSeat(i),
        canSelect: Object.keys(selectedSeats).length < numberOfSeatsToSelect,
      };
      seats.push(seat);
    }
    return seats;
  }, [selectedSeats, passengers, numberOfSeats]);

  const onSelectSeat = (seatInfo: SeatInfo, seat: number) => {
    setSelectedSeats({ ...selectedSeats, [seat]: seatInfo });
  };
  const unSelectSeat = (seat: number) => {
    const seatCopy = { ...selectedSeats };
    delete seatCopy[seat];
    setSelectedSeats(seatCopy);
  };
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="flex flex-col justify-center items-center">
        <GiSteeringWheel className="text-3xl text-black" />
      </div>
      {aggregateSeats.map((seat, i) => (
        <Seat {...seat} key={`seat-${i}`} onSelectSeat={onSelectSeat} />
      ))}
    </div>
  );
};

export const SeatSelector: FC<SeatSelectorProps> = ({
  numberOfSeats,
  booking,
  vehicleNumberOfSeats,
  selectedSeats,
  setSelectedSeats,
  showPayment,
  trip,
  onContinuetoPayment,
  onContinue,
  previousSelectedSeats,
  isReturn,
  onBack,
  backLablel,
}) => {
  const seatSelectionComplete = useMemo(() => {
    return Object.values(selectedSeats).length === numberOfSeats;
  }, [numberOfSeats, selectedSeats]);
  const passengers = useMemo(() => {
    return Object.entries(booking.confirmedPassengers).map(
      ([key, { seatNumber }]) => seatNumber,
    );
  }, [booking.confirmedPassengers]);
  return (
    <>
      {onBack ? (
        <Button
          variant="outline"
          size="sm"
          className="w-max items-center mt-5 mb-3 ml-5"
          onClick={onBack}
        >
          <BsArrowLeft className="mr-2" /> {backLablel || "Back"}
        </Button>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 pb-8">
        <div className="flex flex-col">
          <h3 className="text-xl mt-3 mb-5 text-center font-semibold text-back">
            {`Select ${numberOfSeats} seat(s)`}
          </h3>
          <Seats
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            numberOfSeatsToSelect={numberOfSeats}
            numberOfSeats={vehicleNumberOfSeats}
            passengers={passengers}
          />
        </div>
        <div className="flex flex-col px-5">
          <h3 className="font-semibold text-xl mt-3 mb-5 text-black">
            Passenger(s) Details
          </h3>

          {trip.returnTrip && isReturn && previousSelectedSeats ? (
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-primary mb-3">{`Inbound trip ${trip.from} to ${trip.to} on ${trip.date}`}</h3>
              <SelectedSeatsTable selectedSeats={previousSelectedSeats} />
            </div>
          ) : null}

          {trip.returnTrip && isReturn && previousSelectedSeats ? (
            <h3 className="text-lg font-medium text-primary mt-5 mb-3">{`Outbound trip ${trip.to} to ${trip.from} on ${trip.returnDate}`}</h3>
          ) : null}
          <SelectedSeatsTable selectedSeats={selectedSeats} />
          {showPayment ? (
            <>
              <p className="text-base mb-2 mt-5 text-slate-800">{`Price per person: ${formatNumber(
                booking.price,
                "NGN",
              )}`}</p>
              <p className="text-base mb-4 text-slate-600">{`Total: ${formatNumber(
                booking.price * numberOfSeats * (trip.returnTrip ? 2 : 1),
                "NGN",
              )}`}</p>
            </>
          ) : null}
          {showPayment && seatSelectionComplete && onContinuetoPayment ? (
            <OrderForm onContinuetoPayment={onContinuetoPayment} />
          ) : null}
          {!showPayment && seatSelectionComplete ? (
            <Button onClick={onContinue} size="md" className="my-5">
              Continue
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};
