import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDI9SPVN7-0cTXGAKjRxBW41cABGf1-89I",
    authDomain: "project-management-app-f7fdc.firebaseapp.com",
    projectId: "project-management-app-f7fdc",
    storageBucket: "project-management-app-f7fdc.appspot.com",
    messagingSenderId: "552701597547",
    appId: "1:552701597547:web:ce3165c99d17214f979e2e"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const timestamp = serverTimestamp();

export { app, db, timestamp };