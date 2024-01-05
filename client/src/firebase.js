// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-74ff1.firebaseapp.com",
  projectId: "mern-estate-74ff1",
  storageBucket: "mern-estate-74ff1.appspot.com",
  messagingSenderId: "1055917561481",
  appId: "1:1055917561481:web:665679c0cd49b9e4c8d858"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);