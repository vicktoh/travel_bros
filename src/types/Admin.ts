import { InfoStatus, RegistrationInfo } from "./Driver";

export type RegistrationInfoWithId = RegistrationInfo & { id?: string, status?: InfoStatus};
export type ApproveRegParams = {
   reg: RegistrationInfo & {id?: string};
   price?: number;
   time?: string;
   from: string;
   to: string;
   noOfSeats: number;
 }