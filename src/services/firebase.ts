import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8BFes8F-jHpuDKLQG1Iexys3a3PKVulQ",
  authDomain: "cemic-c588c.firebaseapp.com",
  projectId: "cemic-c588c",
  storageBucket: "cemic-c588c.appspot.com",
  messagingSenderId: "764803976911",
  appId: "1:764803976911:web:9c6910afaab7e00f2971ba",
  measurementId: "G-17RTS2612P",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
