'use client'
import { ReturnTrip, Trip } from '@/types/Booking';
import { Switch } from '@headlessui/react';
import { off } from 'process';
import React, { useState } from 'react';
import { Input } from './common/Input';
import { SelectOption } from './common/SelectOption';
import { SelectInput } from './common/SelectInput';
import { Button } from './common/Button';
const States = [{
   id: '1',
   label: 'Abuja'
}, {id: '1', label: 'Jos'}]
const states = ['Abuja', 'Jos'];
export const HeroForm = () => {
    const [trip, setTrip] = useState<ReturnTrip>({
        returnDate: '',
        to: '',
        from: '',
        returnTrip: false,
        vehicleType: '',
        date: '',
    });
    const [selectedState, setSelectedState] = useState<typeof States[number]>()
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row bg-white py-3 px-16 rounded-md -mb-3">
                <span
                    className={`mr-2 text-base ${
                        !trip.returnTrip ? 'text-amber-900' : 'text-slate-900'
                    }`}
                >
                    One way
                </span>
                <Switch
                    checked={trip.returnTrip}
                    onChange={() =>
                        setTrip({ ...trip, returnTrip: !trip.returnTrip })
                    }
                    className={`${
                        trip.returnTrip ? 'bg-primary' : 'bg-slate-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span
                        className={`${
                            trip.returnTrip
                                ? 'translate-x-6 bg-primary'
                                : 'translate-x-1 bg-primary-light'
                        } inline-block h-4 w-4  transform rounded-full bg-white transition`}
                    />
                </Switch>
                <span
                    className={`ml-2 text-base ${
                        trip.returnTrip ? 'text-amber-900' : 'text-slate-900'
                    }`}
                >
                    Return Trip
                </span>
            </div>
            <div className="flex md:flex-row md:items-center flex-col items-start bg-white pb-10 py-5 gap-3 px-8 rounded-md mw">
                <SelectInput
                    placeholder="Select Origin"
                    label="From"
                    value={trip.from}
                    options={states}
                    onChange={(e) =>
                        setTrip((trip) => ({ ...trip, from: e.target.value }))
                    }
                    className='w-full'
                />
                
                
                
                <SelectInput
                    placeholder="Select Destination"
                    label="To"
                    options={states}
                    value={trip.to}
                    onChange={(e) =>
                        setTrip((trip) => ({ ...trip, to: e.target.value }))
                    }
                    className='w-full'
                />
                <Input
                    type="date"
                    placeholder="Select Date"
                    label="From"
                    value={trip.date}
                    onChange={(e) =>
                        setTrip((trip) => ({ ...trip, date: e.target.value }))
                    }
                    className='w-full'
                />
                {trip.returnTrip ? (
                    <Input
                        placeholder="Select Date"
                        label="Return Date"
                        value={trip.from}
                        onChange={(e) =>
                            setTrip((trip) => ({
                                ...trip,
                                returnDate: e.target.value,
                            }))
                        }
                        className='w-full'
                    />
                ) : null}
                <Button title='Book My Trip now' className='w-full md:self-end md:ml-3' size='md' ></Button>
            </div>
        </div>
    );
};
