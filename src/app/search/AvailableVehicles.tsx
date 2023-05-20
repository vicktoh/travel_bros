'use client';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { getAvailableVehicles } from '@/services/search';
import { Booking, ReturnTrip } from '@/types/Booking';
import { VehicleWithID } from '@/types/Vehicle';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { Page, SelectFlow } from './SelectFlow';
type AvailableVehiclesProps = {
    vehicles: VehicleWithID[];
}

export const AvailableVehicles: FC<AvailableVehiclesProps> = ({vehicles}) => {
    const [fetching, setFetching] = useState(true);
    const [bookings, setBookings] = useState<Booking[]> ([]);
    const [returnBooking, setReturnBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState<Page>("select-vehicle");

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


    const renderPageHeader = ()=> {
        switch (true) {
            case page ==="select-vehicle" || page === "select-return-vehicle":
                return (
                <div className="flex flex-col max-w-full items-start justify-center relative z-10 md:px-0 px-5 mt-5">
                                    <Button
                                        onClick={() => router.push('/')}
                                        size="sm"
                                        variant="outline"
                                        className="bg-white items-center my-5"
                                    >
                                        <BsArrowLeft className="mr-1" /> Go back
                                    </Button>
                                    <p className="text-xl text-slate-300">{`Available ${page === "select-return-seats" ? "return ": ""} trips on ${params.get(
                                       page === "select-return-seats" ? 'returnDate' : 'date'
                                    )}`}</p>

                                    <p className="text-base text-white font-bold mt-6">
                                        <span className="text-slate-50 font-bold mr-5 inline-block">
                                            From:
                                        </span>{' '}
                                        {params.get(page === "select-return-seats" ? "to": 'from')}{' '}
                                    </p>
                                    <p className="text-base text-white font-bold">
                                        <span className="text-slate-50 font-bold mr-5 inline-block">
                                            To:
                                        </span>{' '}
                                        {params.get( page === "select-return-seats" ? "from" :'to')}{' '}
                                    </p>
                                    <p className="text-base mt-5 text-green-600 font-bold">
                                        {params.get('vehicleType')}
                                    </p>
                                </div>
                )
                
                break;
                case page === 'select-seats' || page === 'select-return-seats':
                    return (
                        <div className="flex flex-col max-w-full items-start justify-center relative z-10 md:px-0 px-5 mt-5">
                                            <Button
                                                onClick={() => router.push('/')}
                                                size="sm"
                                                variant="outline"
                                                className="bg-white items-center my-5"
                                            >
                                                <BsArrowLeft className="mr-1" /> Go back
                                            </Button>
                                            <p className="text-xl text-slate-300">Passenger Details</p>
        
                                            <p className="text-base text-white font-bold mt-6">
                                                {`Select ${trip.numberOfSeats} Seat(s)`}
                                            </p>
                                            
                                            <p className="text-base mt-5 text-green-600 font-bold">
                                                {params.get('vehicleType')}
                                            </p>
                                        </div>
                        )
                case page === "Payment":
                    return (
                        <h3 className="text-3xl text-white justify-self-center self-center">Make Payment</h3>
                    )
            default:
                break;
        }

    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <div className="flex border-2 relative flex-col md:min-h-[300px] items-start px-6 justify-center bg-hero-image bg-cover bg-center bg-opacity-60 bg-gray-800">
                <div className="bg-black bg-opacity-40 absolute left-0 right-0 top-0 bottom-0 "></div>

                {
                    renderPageHeader()
                }
            </div>

            {
                fetching ? 
                <Loading />: 
                tripTorender.length ? 
                <>
                <SelectFlow page={page} setPage={setPage} bookings={bookings} returnBookings={returnBooking} trip={trip} />
                </>: 
                <div className="flex flex-col justify-center items-center">
                    <p className="text-xl font-bol">Empty State</p>
                </div>
            }
        </div>
    );
};
