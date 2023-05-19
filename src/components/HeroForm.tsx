"use client";
import { ReturnTrip, Trip } from "@/types/Booking";
import { Switch } from "@headlessui/react";
import { off } from "process";
import React, { useEffect, useState } from "react";
import { Input } from "./common/Input";
import { SelectOption } from "./common/SelectOption";
import { SelectInput } from "./common/SelectInput";
import { Button } from "./common/Button";
import { useRouter } from "next/navigation";
import { isBefore, isPast } from "date-fns";
import { BsPeople } from "react-icons/bs";
import { Gi3DGlasses } from "react-icons/gi";
const States = [
  {
    id: "1",
    label: "Abuja",
  },
  { id: "1", label: "Jos" },
];
const states = ["Abuja", "Jos"];
const vehicles = ["Prestige(5 seater)", "Regular(14 seater)"];
export const HeroForm = () => {
  const [trip, setTrip] = useState<ReturnTrip>({
    returnDate: "",
    to: "",
    from: "",
    returnTrip: false,
    vehicleType: "",
    date: "",
    numberOfSeats: 1,
  });
  const [errorMessages, setErrorMessages] = useState<Record<keyof ReturnTrip, string>>({
    returnDate: "",
    to: "",
    from: "",
    returnTrip: "",
    vehicleType: "",
    date: "",
    numberOfSeats: "",
  });
  const router = useRouter();
  const onSubmitForm = () => {
    const formValid = validateAll();
    console.log({formValid})
    if (!formValid) return;
    const urlParams = new URLSearchParams();
    Object.entries(trip).forEach(([key, value], i) => {
      if (key === "returnTrip" && value === false) return;
      urlParams.set(key, value.toString());
    });
    const path = `/search?${urlParams.toString()}`;
    router.push(path);
  };

  const validate = (field: keyof typeof trip) => {
    const value = trip[field];
    switch (field) {
      case "to":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            to: 'Please select a "To" location',
          });
          return false;
        }
        if (value === trip["from"]) {
          setErrorMessages({
            ...errorMessages,
            to: '"From" and "To" cannot be the same',
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, to: "" });

        break;
      case "from":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            from: 'Please select a "From" location',
          });
          return false;
        }
        if (value === trip["to"]) {
          setErrorMessages({
            ...errorMessages,
            from: '"From" and "To" cannot be the same',
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, from: "" });

        break;
      case "vehicleType":
        if (!value) {
          setErrorMessages({
            ...errorMessages,
            vehicleType: "Please select a vehicle type",
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, vehicleType: "" });

        break;
      case "date":
        if (!trip[field]) {
          setErrorMessages({ ...errorMessages, date: "Please select a date" });
          return false;
        }
        if (isPast(new Date(trip[field]))) {
          setErrorMessages({
            ...errorMessages,
            date: "Can not select a past date",
          });
          return false;
        }
        setErrorMessages({ ...errorMessages, date: "" });

        break;
      case "returnDate":
        if (!trip.returnTrip) {
          setErrorMessages({ ...errorMessages, returnDate: "" });
        }
        if (!trip[field]) {
          setErrorMessages({
            ...errorMessages,
            returnDate: "Please select a date",
          });
          return false;
        }
        if (isPast(new Date(trip[field]))) {
          setErrorMessages({
            ...errorMessages,
            returnDate: "Can not select a past date",
          });
          return false;
        }
        if (
          trip["date"] &&
          trip["returnDate"] &&
          isBefore(new Date(trip["returnDate"]), new Date(trip["date"]))
        ) {
          if (isPast(new Date(trip[field]))) {
            setErrorMessages({
              ...errorMessages,
              returnDate: "Return date cannot be before departure date",
            });
            return false;
          }
        }
        setErrorMessages({ ...errorMessages, returnDate: "" });

        break;
      case 'returnTrip':
        break;
      case 'numberOfSeats': 
        if(trip[field] < 1){
            setErrorMessages(({...errorMessages, numberOfSeats: 'At least 1 passenger is required'}));
            return false;
        }
        break;
      default:
        return false;
        break;
    }
    return true;
  };

  const validateAll = () =>
    Object.entries(trip)
      .filter(([key, value]) => {
        key = key as keyof ReturnTrip;
        if (trip.returnTrip) {
          return true;
        } else {
          return !(key === "returnDate" || key === "returnTrip");
        }
      })
      .every(([key, value]) => {
        const valid = validate(key as any);
        console.log("valid", valid, key);
        return valid;
      });

  useEffect(()=> {
    router.prefetch('/search')
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center bg-white pt-3 pb-4 px-16 rounded-md -mb-3">
        <span
          className={`mr-2 text-base ${
            !trip.returnTrip ? "text-amber-900" : "text-slate-900"
          }`}
        >
          One way
        </span>
        <Switch
          checked={trip.returnTrip}
          onChange={() => setTrip({ ...trip, returnTrip: !trip.returnTrip })}
          className={`${
            trip.returnTrip ? "bg-primary" : "bg-slate-300"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              trip.returnTrip
                ? "translate-x-6 bg-primary"
                : "translate-x-1 bg-primary-light"
            } inline-block h-4 w-4  transform rounded-full bg-white transition`}
          />
        </Switch>
        <span
          className={`ml-2 text-base ${
            trip.returnTrip ? "text-amber-900" : "text-slate-900"
          }`}
        >
          Return Trip
        </span>
        <div className="flex items-center ml-8 gap-3">
          <span className="text-base text-slate-900">Passengers</span>
          <Input
            value={trip.numberOfSeats}
            type="number"
            min={1}
            max={5}
            className=""
            onChange={(e) =>
              setTrip((trip) => ({ ...trip, numberOfSeats: Number(e.target.value)}))
            }
            placeholder=""
            buttonSize="sm"
          />
        </div>
      </div>
      <div className="flex md:flex-row md:items-center  flex-col items-start bg-white pb-6 py-5 gap-3 px-8 rounded-md mw">
        <SelectInput
          placeholder="Select Origin"
          label="From"
          buttonSize="md"
          value={trip.from}
          options={states}
          onChange={(e) =>
            setTrip((trip) => ({ ...trip, from: e.target.value }))
          }
          containerClassName="self-start"
          className="w-full md:min-w-[170px]"
          error={errorMessages.from}
          onBlur={() => validate("from")}
        />

        <SelectInput
          placeholder="Select Destination"
          label="To"
          options={states}
          value={trip.to}
          buttonSize="md"
          onChange={(e) => setTrip((trip) => ({ ...trip, to: e.target.value }))}
          className="w-full md:min-w-[170px]"
          containerClassName="self-start"
          error={errorMessages.to}
          onBlur={() => validate("to")}
        />
        <SelectInput
          placeholder="Vehicle type"
          label="Vehicle type"
          options={vehicles}
          value={trip.vehicleType}
          buttonSize="md"
          onChange={(e) =>
            setTrip((trip) => ({ ...trip, vehicleType: e.target.value }))
          }
          className="w-full md:min-w-[170px]"
          containerClassName="self-start"
          error={errorMessages.vehicleType}
          onBlur={() => validate("vehicleType")}
        />
        <Input
          type="date"
          placeholder="Select Date"
          label="Date"
          buttonSize="md"
          value={trip.date}
          onChange={(e) =>
            setTrip((trip) => ({ ...trip, date: e.target.value }))
          }
          className="w-full md:min-w-[80px]"
          containerClassName="self-start"
          error={errorMessages.date}
          onBlur={() => validate("date")}
        />
        {trip.returnTrip ? (
          <Input
            placeholder="Select Date"
            label="Return Date"
            type="date"
            buttonSize="md"
            value={trip.returnDate}
            onChange={(e) =>
              setTrip((trip) => ({
                ...trip,
                returnDate: e.target.value,
              }))
            }
            className="w-full md:min-w-[170px]"
            containerClassName="self-start"
            error={errorMessages.returnDate}
            onBlur={() => validate("returnDate")}
          />
        ) : null}
        <Button
          title="Book now"
          onClick={onSubmitForm}
          className="w-full md:self-center md:ml-3 min-w-[120px]"
          size="md"
        ></Button>
      </div>
    </div>
  );
};
