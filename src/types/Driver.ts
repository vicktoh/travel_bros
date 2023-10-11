import { VehicleStatus } from "./Vehicle";

export type DriverStatus = 'onboarded' | 'pending' | 'active' | 'completed';
export type InfoStatus = 'empty' | 'rejected' | 'pending' | 'complete';
export interface Driver {
   fullname: string;
   email: string;
   status?: DriverStatus;
   photoURL: string;
   totalEarned?: number;
   totalTrips?: number;
   rating?: string;
   contact: {
      address: string;
      phoneNumber: string;
      city: string;
      state: string;
   },
   nextOfKinContact: {
      name: string;
      address: string;
      phoneNumber: string;
      relationship: string;
   
   },
   dateOfBirth: number;
   gender: typeof genders[number];
   lastUpdated: number
   
}
export const genders = ["male", "female"] as const;
export interface RegistrationInfo {
   userId: string;
   dateCreated?: number;
   lastUpdated?: number;
   readCount?: number;
   messageCount?: number;
   driverLicense: {
      driverLicenseNumber: string;
      dateIssued: string;
      issuingState: string;
      expiryDate: string;
      frontUrl: string;
      backUrl: string;
   },
   vehicleInformation: {
      model: string;
      yearOfManufacture: string;
      numberOfSeats: string;
      licensePlateNumber: string;
      vehicleRegistrationNumber: string;
      registrationDocumentUrl: string;
      proofOfInsurance: string;
      photos: string[]
      employmentHistory: string;
   }
   status: VehicleStatus
}


