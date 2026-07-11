import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyBUEpV4ldxQJ3t_jUDntTDp10TDHjxYo",
  authDomain: "kumbumarket.firebaseapp.com",
  projectId: "kumbumarket",
  storageBucket: "kumbumarket.firebasestorage.app",
  messagingSenderId: "226380189125",
  appId: "1:226380189125:web:6bf487ca80d1dfa94ecfac"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
