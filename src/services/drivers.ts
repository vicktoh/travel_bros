import { SigninField } from "@/app/drivers/signin/signin-form";
import { SignupField } from "@/app/drivers/signup/signup-form";
import { app, auth, db } from "@/firebase";
import { useAuthStore, useDriverStore } from "@/states/drivers";
import { Driver, RegistrationInfo } from "@/types/Driver";
import { Auth, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
export const onRegisterDriver = async(driver: SignupField) => {
  const user = await createUserWithEmailAndPassword(auth, driver.email, driver.password);
  await updateProfile(user.user, {displayName: driver.fullname})
  return user;
}

export const signIndriver = async (driver: SigninField) => {
   const user = await signInWithEmailAndPassword(auth, driver.email, driver.password);
   return user;
}
export const createDBDriver = async (driverId: string, {fullname, email}: SignupField) => {
   const driverRef = doc(db, `drivers/${driverId}`);
   await setDoc(driverRef, { fullname, email });
}

export const driverLogout = async () => {

   await signOut(auth)
   const {logOut} = useAuthStore.getState()
   logOut()
}


export const listenOnDriver = (driverId: string, callback: (driver: Driver) => void) => {
   const driverRef = doc(db, `drivers/${driverId}`);
   return onSnapshot(driverRef, (snap) => {
      const driverData = snap.data() as Driver;
      callback(driverData)
   })
}


export const listenOnAuth = (callback: (user: User | null) => void) => {
   const auth = getAuth(app)
   return onAuthStateChanged(auth, ( user) => {
      callback(user);
   })
}

export const listenOnRegistration = (userId:string, callback: (registsration: RegistrationInfo | null)=> void) => {
   const dbRef = doc(db, `registration/${userId}`);
   return onSnapshot(dbRef, (snapshot) => {
      if(snapshot.exists()){
         callback(snapshot.data() as RegistrationInfo);
         return;
      }
      callback(null);
   })
}

export function updateDocument<T extends Record<string, any>>(path: string, data: T){
   const documentRef = doc(db, path);
   return updateDoc(documentRef, data)
}
export function newDocument<T extends Record<string, any>>(path: string, data:T){
   const documentRef = doc(db, path);
   return setDoc(documentRef, data)
}
export function getDocument(path: string){
   const documentRef = doc(db, path);
   return getDoc(documentRef)
}


export const uploadDocument = (
  file: Blob | File,
  path: string,
  onProgress: (progress: number) => void,
  onSuccess: (url: string) => void,
  onError: (message: string) => void = ()=>  {},
) => {
  const storage = getStorage(app);
  const fileRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    },
    (error) => onError(error.message),
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      onSuccess(url)
    }
  );
};

export const sendRegForApproval = async() => {
   const functions = getFunctions(app, "europe-west1");
   const requestDriverApproval = httpsCallable<
     undefined,
     { status: number; message: string }
   >(functions, "requestDriverRegistrationApproval");
   return requestDriverApproval();
}