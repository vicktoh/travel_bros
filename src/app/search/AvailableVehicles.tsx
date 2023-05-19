'use client';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { getAvailableVehicles } from '@/services/search';
import { Booking, ReturnTrip } from '@/types/Booking';
import { VehicleWithID } from '@/types/Vehicle';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { SelectFlow } from './SelectFlow';
type AvailableVehiclesProps = {
    vehicles: VehicleWithID[];
}

export const AvailableVehicles: FC<AvailableVehiclesProps> = ({vehicles}) => {
    const [fetching, setFetching] = useState(true);
    const [bookings, setBookings] = useState<Booking[]> ([]);
    const [returnBooking, setReturnBookings] = useState<Booking[]>([]);
    console.log({vehicles})
    const params = useSearchParams();
    const trip  = useMemo(()=> {
        return  {
            to: params.get('to'),
            from: params.get('from'),
            date: params.get('date'),
            returnDate: params.get('returnDate'),
            returnTrip: !!params.get('returnTrip'),
            vehicleType: params.get('vehicleType'),
            numberOfSeats: Number(params.get('numberOfSeats'))
        } as ReturnTrip
    }, [params])

    const tripTorender = useMemo(()=> {
        return trip.returnTrip ? [...(bookings || []), ...(returnBooking || [])] : (bookings || [])
    }, [bookings, returnBooking, trip.returnTrip])
    const router = useRouter();
    const fetchAvaliableVehilce = useCallback(async ()=> {
        try {
            setFetching(true);
            const bookings = await getAvailableVehicles({to: params.get('to')!, from: params.get('from')!, date: params.get('date')!}, vehicles)
            setBookings(bookings);
            if(params.get('returnTrip') && params.get('returnDate')){
                const returnBookings = await getAvailableVehicles({to: params.get('from')!, from: params.get('to')!, date: params.get('returnDate')!}, vehicles);
                setReturnBookings(returnBookings)
            }
        } catch (error) {
            
        } finally {
            setFetching(false);
        }
    }, [params, vehicles])
    useEffect(()=>{
        fetchAvaliableVehilce()
    }, [fetchAvaliableVehilce])


    const renderPage = ()=> {

    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <div className="flex border-2 relative flex-col md:min-h-[300px] items-start px-6 justify-center bg-hero-image bg-cover bg-center bg-opacity-60 bg-gray-800">
                <div className="bg-black bg-opacity-40 absolute left-0 right-0 top-0 bottom-0 "></div>

                <div className="flex flex-col max-w-full items-start justify-center relative z-10 md:px-0 px-5 mt-5">
                    <Button
                        onClick={() => router.push('/')}
                        size="sm"
                        variant="outline"
                        className="bg-white items-center my-5"
                    >
                        <BsArrowLeft className="mr-1" /> Go back
                    </Button>
                    <p className="text-3xl text-white">{`Available trips on ${params.get(
                        'date'
                    )}`}</p>

                    <p className="text-lg text-white font-medium mt-6">
                        <span className="text-slate-50 font-bold mr-5 inline-block">
                            From:
                        </span>{' '}
                        {params.get('from')}{' '}
                    </p>
                    <p className="text-lg text-white font-medium">
                        <span className="text-slate-50 font-bold mr-5 inline-block">
                            To:
                        </span>{' '}
                        {params.get('to')}{' '}
                    </p>
                    <p className="text-lg mt-5 text-green-600 font-bold">
                        {params.get('vehicleType')}
                    </p>
                </div>
            </div>

            {
                fetching ? 
                <Loading />: 
                tripTorender.length ? 
                <>
                <SelectFlow bookings={bookings} returnBookings={returnBooking} trip={trip} />
                </>: 
                <div className="flex flex-col justify-center items-center">
                    <p className="text-xl font-bol">Empty State</p>
                </div>
            }
        </div>
    );
};
