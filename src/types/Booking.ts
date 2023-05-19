
export type SingleTrip = {
   date: string;
   returnTrip: false;
   from: string;
   to: string;
   vehicleType:string;
}
export type ReturnTrip = {
   date: string;
   returnTrip: boolean;
   returnDate: string;
   from: string;
   to: string;
   vehicleType:string;
   numberOfSeats: number;
}

export type Destination = Pick<ReturnTrip, 'date' | 'from' | 'to'>

export type Trip = SingleTrip | ReturnTrip;

export type ConfirmedPassenger = {
   name: string;
   seatNumber: number;
   phone?: string;
   nextOfKinPhone?: string;
   paymentRef?: string;
}
export type Booking = {
   id: string;
   date: string;
   dateTimestamp: number;
   timeString: string;
   vehicleId: string;
   from: string;
   to: string;
   vehicleType: string;
   availableSeats: number;
   confirmedPassenger: ConfirmedPassenger[];
   price: number;
}

export type SeatInfo = {
   name: string;
   gender: 'male' | 'female';
   phone?: string;

}