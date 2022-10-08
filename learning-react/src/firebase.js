import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getDatabase} from "firebase/database"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyAEmHs98rkncHla_UrNOzOeBIyiofb6ZFQ",
  authDomain: "vacateme-75946.firebaseapp.com",
  projectId: "vacateme-75946",
  storageBucket: "vacateme-75946.appspot.com",
  messagingSenderId: "773638070568",
  appId: "1:773638070568:web:ae06bfa59cc561400bf01d",
  measurementId: "G-VPFT9GFHEG",
  appAssociation: "AUTO",
  rewrites: [ { "source": "/room/**", "dynamicLinks": true } ],

// Another project
  // apiKey: "AIzaSyCnoXs6ghN4Rb3_ZxWh9RccAa37FRyV9-c",
  // authDomain: "civil-planet-357119.firebaseapp.com",
  // projectId: "civil-planet-357119",
  // storageBucket: "civil-planet-357119.appspot.com",
  // messagingSenderId: "943210427754",
  // appId: "1:943210427754:web:1dca465fcffc3b8cd56113",
  // measurementId: "G-PCS8NHRK99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const db = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage(app)
export const functions = getFunctions(app);