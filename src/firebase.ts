import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3D0YlEjmtQ2etmm_wudf-Fejcs5rlvLg",
  authDomain: "techplug-2300c.firebaseapp.com",
  projectId: "techplug-2300c",
  storageBucket: "techplug-2300c.firebasestorage.app",
  messagingSenderId: "97996227503",
  appId: "1:97996227503:web:df92340e6866718b00255a",
  measurementId: "G-P07WWQE28R"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);