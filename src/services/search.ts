
import { db } from '@/firebase'
import { Booking, Destination, ReturnTrip, SeatInfo } from '@/types/Booking'
import { VehicleWithID } from '@/types/Vehicle'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { PAYMENT_COLLECTION } from './constants'

export const checkAvailability = async (trip: {from: string, to: string, date: string}) => {
   const ref = collection(db, 'bookings');
   const q = query(ref, where('from', '==', trip.from), where('date', '==', trip.date));
   const snapshot = await getDocs(q);

   const bookings: Booking[] = [];
   snapshot.forEach((snap) => {
      const data =  snap.data() as Booking;
      data.id = snap.id
      bookings.push(data);
   });

   return bookings
}

export const getAvailableVehicles = async (trip: Destination, vehicles: VehicleWithID[]) => {
   const { to, from, date } = trip;
   // Single trips
   console.log("hello")
   const bookings = await checkAvailability({to, from, date});
   console.log({bookings})
      if(bookings.length && bookings.length === vehicles.length){
         return bookings;
      }
      if(!bookings.length && vehicles.length){
         return  vehicles.map((vehicle)=> vehicleToBooking (vehicle, {to, from, date}))
      }

      if(bookings.length < vehicles.length){
         const bookingVehicleIds = bookings.map(({vehicleId}) => vehicleId)
         const vehiclesToAdd = vehicles.filter(({id}) => !bookingVehicleIds.includes(id));
         return [...bookings, ...vehiclesToAdd.map((vehicle)=> vehicleToBooking(vehicle, { from, to ,date}))]
      }

      return bookings;
}

export function sortAndGroupBookingByTime (bookings: Booking[]){
   bookings = bookings.sort((a, b)=> {
      if(a.dateTimestamp < b.dateTimestamp) return 1
      if(a.dateTimestamp > b.dateTimestamp) return -1
      return 0
   });
   const timeCategories: Record<string, Booking[]> = {};

   bookings.forEach((booking) => {
      if(timeCategories[booking.timeString]){
         timeCategories[booking.timeString].push(booking);
      }else{
         timeCategories[booking.timeString] = [booking]
      }
   })
   return timeCategories;
}

function vehicleToBooking (vehicle: VehicleWithID, trip: Destination) {
   return {
availableSeats: vehicle.numberOfSeats,
date: trip.date,
dateTimestamp: new Date(`${trip.date} ${vehicle.departureTimeString}`).getTime(),
timeString: vehicle.departureTimeString,
confirmedPassenger: [],
from: trip.from,
to: trip.to,
vehicleId: vehicle.id,
vehicleType: vehicle.vehicleType,
id: '',
price: vehicle.price,
   } as Booking
}

export const fetchVehicles = async ()=> {
   const ref = collection(db, "vehicles")
   const snapShot = await getDocs(ref);
   const vehicles: VehicleWithID[] = [];
   snapShot.forEach((snap) => {
      const vehicle = snap.data() as VehicleWithID
      vehicle.id = snap.id;
      vehicles.push(vehicle);
   });
   return vehicles;
}
export const getPaymentRef = async ()=> {
   const ref = collection(db, PAYMENT_COLLECTION)
   const paymentRef = doc(ref)
   return paymentRef.id;
}
type PaymentInfo = {
   trip: ReturnTrip;
   transactionRef: string;
   total: number;
   email: number;
   seats: SeatInfo[];
   returnSeats?: SeatInfo[];
}
export const storePaymentRef = async (payment: PaymentInfo) => {
   const payMentRef = doc(db, `${PAYMENT_COLLECTION}/${payment.transactionRef}`);
   return setDoc(payMentRef, payment);
}