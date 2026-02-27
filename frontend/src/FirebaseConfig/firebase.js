// Import the functions you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // ✅ add this
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAR-TIvzl3d2qHyDO6ymV4fpWmnARu-Ks0",
  authDomain: "dummy-7202f.firebaseapp.com",
  projectId: "dummy-7202f",
  storageBucket: "dummy-7202f.firebasestorage.app",
  messagingSenderId: "382939990729",
  appId: "1:382939990729:web:896422b6207eaf96771b18",
  measurementId: "G-L6PGYPKCWE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database ✅
export const database = getDatabase(app);

// (Optional) Analytics
const analytics = getAnalytics(app);
