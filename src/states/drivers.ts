import { Driver, RegistrationInfo } from "@/types/Driver";
import { create } from "zustand";
export type DriverUser = {
   uid ?: string;
   email: string;
   displayName?: string;
   phoneNumber?: string;
   photoURL?: string;
}
type AuthState = {
   user: DriverUser | null,
   setUser: (user: DriverUser) => void;
   logOut: () => void;
}
export const useAuthStore = create<AuthState>()((set, get) => ({
   user: null,
   setUser: (user: DriverUser) => set((state) => ({ ...state, user})),
   logOut: () => set((state) => ({ ...state, user: null})),
}))
type RegistrationState = {
   registration: RegistrationInfo | null,
   setRegistration: (registration: RegistrationInfo | null) => void;

}
export const useRegistrationStore = create<RegistrationState>()((set)=> ({
   registration: null,
   setRegistration: (registration: RegistrationInfo | null) => set((state) => ({...state, registration})),
}))

type DriverState = {
   driver: Driver | null,
   setDriver: (driver: Driver) => void;
}
export const useDriverStore = create<DriverState>()((set)=> ({
   driver: null,
   setDriver: (driver: Driver) => set((state) => ({...state, driver})),
}))