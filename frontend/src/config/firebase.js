// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaZ_sSx8lX0WbWxyEEoTHn93hGunHaRX4",
  authDomain: "steer-u.firebaseapp.com",
  projectId: "steer-u",
  storageBucket: "steer-u.firebasestorage.app",
  messagingSenderId: "382585440289",
  appId: "1:382585440289:web:85458b9476616d2d453b60",
  measurementId: "G-1WQH6WL5HL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
