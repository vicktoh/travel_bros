import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

export const PAYMENT_COLLECTION = 'placements';

export const BOOKING_COLLECTION = 'bookings';

export const  errorMap: Record<string, string> = {
   "auth/wrong-password": "Invalid Credentials",
   "auth/too-many-requests": "Too many requests",
   "auth/email-already-in-use": "User with that email already exists",
   "auth/user-not-found": "There is no user with that email"
}

export const DEPARTURE_TIMES = ["8AM", "2PM"]