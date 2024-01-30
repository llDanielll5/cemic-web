import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

let cemicstorage = "gs://cemic-c588c.appspot.com/";
let teststorage = "gs://teste-d305e.appspot.com";
let testconfig = {
  apiKey: "AIzaSyA3KzT4_pZ8niDUMz1x80m83D2HBaFpgB8",
  authDomain: "teste-d305e.firebaseapp.com",
  projectId: "teste-d305e",
  storageBucket: "teste-d305e.appspot.com",
  messagingSenderId: "119260607616",
  appId: "1:119260607616:web:a2f6e53aa66bdab5c32265",
  measurementId: "G-1L4L6D4R67",
};

const firebaseConfig = testconfig;

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app, teststorage);
export const auth = getAuth(app);
