import { SigninField } from "@/app/drivers/signin/signin-form";
import { SignupField } from "@/app/drivers/signup/signup-form";
import { app, auth, db } from "@/firebase";
import { useAuthStore, useDriverStore } from "@/states/drivers";
import { RegistrationInfoWithId } from "@/types/Admin";
import { Driver, RegistrationInfo } from "@/types/Driver";
import { NotificationWithId } from "@/types/System";
import {
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
export const onRegisterDriver = async (driver: SignupField) => {
  const user = await createUserWithEmailAndPassword(
    auth,
    driver.email,
    driver.password,
  );
  await updateProfile(user.user, { displayName: driver.fullname });
  return user;
};

export const signIndriver = async (driver: SigninField) => {
  const user = await signInWithEmailAndPassword(
    auth,
    driver.email,
    driver.password,
  );
  return user;
};
export const createDBDriver = async (
  driverId: string,
  { fullname, email }: SignupField,
) => {
  const driverRef = doc(db, `drivers/${driverId}`);
  await setDoc(driverRef, { fullname, email });
};

export const driverLogout = async () => {
  await signOut(auth);
  const { logOut } = useAuthStore.getState();
  logOut();
};

export const listenOnDriver = (
  driverId: string,
  callback: (driver: Driver) => void,
) => {
  const driverRef = doc(db, `drivers/${driverId}`);
  return onSnapshot(driverRef, (snap) => {
    const driverData = snap.data() as Driver;
    callback(driverData);
  });
};

export const listenOnAuth = (callback: (user: User | null) => void) => {
  const auth = getAuth(app);
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const listenOnRegistration = (
  userId: string,
  callback: (registsration: boolean | null) => void,
) => {
  const regQuery = query(collection(db, `registration`), where("userId", "==", userId), limit(1))
  return onSnapshot(regQuery, (snapshot) => {
    callback(snapshot.docs.length > 0);
  });
};


export function updateDocument<T extends Record<string, any>>(
  path: string,
  data: T,
) {
  const documentRef = doc(db, path);
  return updateDoc(documentRef, data);
}
export function newDocument<T extends Record<string, any>>(
  path: string,
  data: T,
) {
  const documentRef = doc(db, path);
  return setDoc(documentRef, data);
}
export function getDocument(path: string) {
  const documentRef = doc(db, path);
  return getDoc(documentRef);
}

export const uploadDocument = (
  file: Blob | File,
  path: string,
  onProgress: (progress: number) => void,
  onSuccess: (url: string) => void,
  onError: (message: string) => void = () => {},
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
      onSuccess(url);
    },
  );
};

export const sendRegForApproval = async () => {
  const functions = getFunctions(app, "europe-west1");
  const requestDriverApproval = httpsCallable<
    undefined,
    { status: number; message: string }
  >(functions, "requestDriverRegistrationApproval");
  return requestDriverApproval();
};

export const listenOnMyDriverRegistration = (
  userId: string,
  setRegistrations: (registration: RegistrationInfoWithId[]) => void,
  onError?: (message: string) => void,
) => {
   console.log("userId: " + userId)
  const driversCollectionRef = query(
    collection(db, "registration"),
    where("userId", "==", userId),
    orderBy("dateCreated", "desc"),
  );
  return onSnapshot(
    driversCollectionRef,
    (querySnapshot) => {
      const regs: RegistrationInfoWithId[] = [];
      querySnapshot.forEach((snap) => {
        const reg = snap.data() as RegistrationInfoWithId;
        reg.id = snap.id;
        regs.push(reg);
      });
      setRegistrations(regs);
    },
    (error) => {
      console.log("fetch registration error: " + error);
      onError && onError(error.message);
    },
  );
};

export const listenOnNotifications = (userId: string, callback: (notifications: NotificationWithId[]) => void, onError?: (error:string) => void) => {
  const notificationRef = query(collection(db, `drivers/${userId}/notifications`), orderBy("timestamp", "desc"), limit(50))
  return onSnapshot(notificationRef, (snapshot) => {
    const nots: NotificationWithId[] = [];
    snapshot.forEach((snap) => {
      const not = snap.data() as NotificationWithId
      not.id = snap.id
      nots.push(not);
    });
    callback(nots);
  }, (error) => {
    onError && onError(error.message);
  })
}
