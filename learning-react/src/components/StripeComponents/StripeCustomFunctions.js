import { onValue, ref } from "firebase/database";
import { addDoc, doc, onSnapshot, collection, setDoc } from "firebase/firestore"; 
import { httpsCallable } from "firebase/functions";
import { auth, db, firestore, functions } from "../../firebase";
import { getStripe } from "./initializeStripe";

export async function createCheckoutSession(uid, currUser) {

  const stripePK = await getStripe();

  onValue(ref(db, `rooms/${currUser.room}/members`), async (snapshot) => {
    const data = snapshot.val()
    const usersNumber = Object.values(data).length

    const docRef = await addDoc(collection(firestore, "customers", `${uid}`, "checkout_sessions"), {
      success_url: window.location.origin,
      cancel_url: window.location.origin,
      line_items: [
        {price: 'price_1M7GvpFlIMqx6x27cGovh6fp', quantity: usersNumber},
      ]
    })

    onSnapshot(doc(firestore, "customers", `${uid}`, "checkout_sessions", docRef.id), (doc) => {
      console.log("Current data: ", doc.data());
      const { sessionId } = doc.data();
      console.log(sessionId)
      if(sessionId) stripePK.redirectToCheckout({sessionId: sessionId});
  
      const complete = httpsCallable(functions, "completeCustomerSetUp")
      complete({sessionId: sessionId})
    });
  })
  // Wait for the CheckoutSession to get attached by the extension
  
}

export async function calcSubscription(currUser, userLeave = false, cancelSubscription = false) {
  auth.onAuthStateChanged(user => {
      if(user && currUser.room) {
        onSnapshot(doc(firestore, "customers", `${currUser.room}`), (snap) => {
            const leadStripeId = snap.data().stripeId

            const getList = httpsCallable(functions, "getSubscriptions");
            getList({customerId: leadStripeId})
            .then(res => { 
              const subscriptionId = res.data.data[0].id 
              onValue(ref(db, `rooms/${currUser.room}/members`), (snapshot) => {
                const data = snapshot.val()
                const usersNumber = Object.values(data).length - userLeave
                if(!cancelSubscription) {

                  const updateSubscription = httpsCallable(functions, "updateSubscription")
                  updateSubscription({subscriptionId: subscriptionId, usersNumber: usersNumber})
                  .then(res => console.log(res))
                  .catch(e => console.log(e))
                  
                } 
                else if(cancelSubscription) {
                  const updateSubscription = httpsCallable(functions, "updateSubscription")
                  updateSubscription({subscriptionId: subscriptionId, cancelSubscription: true})
                  .then(res => console.log(res))
                  .catch(e => console.log(e))
                }
                else console.log("Can't cancel the subscription!")
              })
            })
            .catch(e => console.log(e))
        })
      }
  })
}
