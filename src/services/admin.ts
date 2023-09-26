import { app, auth, db } from "@/firebase"
import { ApproveRegParams, RegistrationInfoWithId } from "@/types/Admin";
import { RegistrationInfo } from "@/types/Driver";
import { User, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export const signInAdmin = async(email: string, password: string) => {

   const authUser = await signInWithEmailAndPassword(auth, email, password);
   const { claims } = await authUser.user.getIdTokenResult();
   if(claims.admin !== true){
      signOut(auth);
      throw new Error(`Unauthorized access`);
   }

   return authUser.user
}

export const listenOnAuth = (callback: (user: User | null) => void) => {
   const auth = getAuth(app)
   return onAuthStateChanged(auth, async ( user) => {
      const { claims } = await user?.getIdTokenResult() || {};
      if(!claims?.admin) throw new Error(`Unauthorized user`);
      callback(user);
   })
}

export const listenOnRegistration = async (callback: (registrations: RegistrationInfoWithId[])=>void) => {
   const registrationRef =  collection(db, `registration`);
   return onSnapshot(registrationRef, (snapshot) => {
      const regs: RegistrationInfoWithId[] = [];
      snapshot.forEach((snap) => {
         const registration = snap.data() as RegistrationInfoWithId;
         regs.push(registration);
      });
      callback(regs);
   })
}

export const approveRegistration = async(params: ApproveRegParams) => {
   const functions = getFunctions(app, "europe-west1");
   const approve = httpsCallable<
     ApproveRegParams,
     { status: number; message: string }
   >(functions, "approveRegistration");
   return approve(params);
}