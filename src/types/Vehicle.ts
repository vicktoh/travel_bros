export interface Vehicle {
   driverName: string;
   departureTimeString: string;
   departureTimeTimestamp: number;
   numberOfSeats: number;
   vehicleType: string;
   price: number;
}

export interface VehicleWithID extends Vehicle {
   id: string;
}

export type VehicleStatus = "active" | "pending" | "unavailable" | "failed"