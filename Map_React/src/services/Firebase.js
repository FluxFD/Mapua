import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBaxHH-6DLzyJa89gvsF8cF8q48TYlcMmI",
  authDomain: "mapua-f1526.firebaseapp.com",
  databaseURL: "https://mapua-f1526-default-rtdb.firebaseio.com",
  projectId: "mapua-f1526",
  storageBucket: "mapua-f1526.appspot.com",
  messagingSenderId: "1086364766487",
  appId: "1:1086364766487:web:bf6116d5a551c9bcb96752"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
