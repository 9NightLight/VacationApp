import { addDoc, doc, onSnapshot, collection, setDoc } from "firebase/firestore"; 
import { httpsCallable } from "firebase/functions";
import { auth, firestore, functions } from "../../firebase";
import { getStripe } from "./initializeStripe";

export async function createCheckoutSession(uid) {

  const stripePK = await getStripe();
  
  const docRef = await addDoc(collection(firestore, "customers", `${uid}`, "checkout_sessions"), {
    success_url: window.location.origin,
    cancel_url: window.location.origin,
    line_items: [
      {price: 'price_1M7GvpFlIMqx6x27cGovh6fp', quantity: 2},
    ]
  })

  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(doc(firestore, "customers", `${uid}`, "checkout_sessions", docRef.id), (doc) => {
    console.log("Current data: ", doc.data());
    const { sessionId } = doc.data();
    console.log(sessionId)
    if(sessionId) stripePK.redirectToCheckout({sessionId: sessionId});

    const complete = httpsCallable(functions, "completeCustomerSetUp")
    complete({sessionId: sessionId})
  });
}
