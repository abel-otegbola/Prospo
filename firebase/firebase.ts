// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAenBYd3wJPo7cuPLAdvwIA7WMNMW8CNA",
    authDomain: "flashleads-f217e.firebaseapp.com",
    projectId: "flashleads-f217e",
    storageBucket: "flashleads-f217e.firebasestorage.app",
    messagingSenderId: "364055522024",
    appId: "1:364055522024:web:7cdd16d9174a712e8df75d",
    measurementId: "G-3V76XD0DGN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)
export const db = getFirestore();