// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const appEnv = process.env.NEXT_PUBLIC_APP_ENV!

const devFirebaseConfig =  {
  apiKey: "AIzaSyADHBk_sQmhdSDAKM18r4tmaatWcWCSnCk",
  authDomain: "travel-bros-dev.firebaseapp.com",
  projectId: "travel-bros-dev",
  storageBucket: "travel-bros-dev.appspot.com",
  messagingSenderId: "937039897523",
  appId: "1:937039897523:web:ecf1d010f39358c9dee1c6"
};
const firebaseConfig = {
  apiKey: "AIzaSyCI5bEBRgsHCfZTu33jABfWF6I4uuqvl_U",
  authDomain: "travel-bros.firebaseapp.com",
  databaseURL: "https://travel-bros-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "travel-bros",
  storageBucket: "travel-bros.appspot.com",
  messagingSenderId: "266074073677",
  appId: "1:266074073677:web:4710b5e7e42fbd7fac0a04",
  measurementId: "G-RRBWN49908",
  
} as FirebaseOptions;

// Initialize Firebase
export const app = initializeApp(appEnv === "dev"? devFirebaseConfig : firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
