import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB4iu9hWAjqgNVrsM0-1O_KejtM4tQhuZ0",
  authDomain: "reservation-e7e3c.firebaseapp.com",
  databaseURL: "https://reservation-e7e3c-default-rtdb.firebaseio.com",
  projectId: "reservation-e7e3c",
  storageBucket: "reservation-e7e3c.appspot.com",
  messagingSenderId: "246127805295",
  appId: "1:246127805295:web:bf0a7549d5b7adfb3fde9a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
