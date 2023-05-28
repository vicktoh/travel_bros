import { getFunctions, httpsCallable } from "firebase/functions";
import { app, db } from "@/firebase"
import { Booking, BookingChange } from "@/types/Booking";
import { PaymentInfo } from "@/types/Payment";
import { doc, getDoc, onSnapshot } from "firebase/firestore"



export const getBooking = async (ref: string) => {
   const docRef = doc(db, `confirmed/${ref}`);
   const paymentRef =  await getDoc(docRef);
   if(!paymentRef.exists()) return false;
   const paymentData = paymentRef.data() as PaymentInfo;
   console.log(paymentData.booking)
   const booking = await getDoc(doc(db, `bookings/${paymentData.booking.id}`));
   
   if(booking.exists()){
      paymentData.booking = booking.data() as Booking;
   }
   if(paymentData.returnBooking?.id ){
      const returnBooking = await getDoc(doc(db, `bookings/${paymentData.returnBooking.id}`));
      paymentData.returnBooking = returnBooking.data() as Booking;
   }
   return paymentData;

}

export const listenOnRef = (ref: string, callback: (paymeinfo: PaymentInfo | false) => void) => {
   const docRef = doc(db, `confirmed/${ref}`);
   const unsubscribe = onSnapshot(docRef, (snap)=> {
      if(snap.exists()){
         const paymentData = snap.data() as PaymentInfo;
         callback(paymentData);
         return;
      } else{

         callback(false)
      }


   });
   return unsubscribe;
}

export const rescheduleBooking = async(bookingChange: BookingChange) => {
   const functions = getFunctions(app, "europe-west1");
   const reschedule = httpsCallable<
     BookingChange,
     { status: number; message: string }
   >(functions, "rescheduleBookings");
   return reschedule(bookingChange);
}