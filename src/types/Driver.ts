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
   
}
export const genders = ["male", "female"] as const;
export interface RegistrationInfo {
   userId: string;
   dateCreated?: number;
   lastUpdated?: number;
   fullname: string;
   email:string;
   dateOfBirth: number;
   gender: typeof genders[number];
   contact: {
      address: string;
      phoneNumber: string;
      city: string;
      state: string;
   },
   photoURL: string;
   nextOfKinContact: {
      name: string;
      address: string;
      phoneNumber: string;
      relationship: string;
   
   },
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
}


