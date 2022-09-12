import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getDatabase} from "firebase/database"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
  measurementId: "measurementId",
  appAssociation: "appAssociation",
  rewrites: [ { "source": "/room/**", "dynamicLinks": true } ]
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const db = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage(app)
export const functions = getFunctions(app);
