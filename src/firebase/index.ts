// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
