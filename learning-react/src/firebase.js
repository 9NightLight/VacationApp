import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getDatabase} from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAEmHs98rkncHla_UrNOzOeBIyiofb6ZFQ",
  authDomain: "vacateme-75946.firebaseapp.com",
  projectId: "vacateme-75946",
  storageBucket: "vacateme-75946.appspot.com",
  messagingSenderId: "773638070568",
  appId: "1:773638070568:web:ae06bfa59cc561400bf01d",
  measurementId: "G-VPFT9GFHEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const db = getDatabase(app);
export const auth = getAuth();