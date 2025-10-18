// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO1e4qMfgipdFyreYnfKeOuQH5uBb2g9g",
  authDomain: "studio-7639868049-100f7.firebaseapp.com",
  projectId: "studio-7639868049-100f7",
  storageBucket: "studio-7639868049-100f7.firebasestorage.app",
  messagingSenderId: "805708614888",
  appId: "1:805708614888:web:814632369a994e13874d5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;