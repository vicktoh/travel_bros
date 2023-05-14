
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
}

export type Trip = SingleTrip | ReturnTrip;