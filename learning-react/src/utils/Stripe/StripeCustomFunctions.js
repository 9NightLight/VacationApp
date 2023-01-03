// @ts-check

import { onValue, ref } from "firebase/database";
import { addDoc, doc, onSnapshot, collection, setDoc, getDoc } from "firebase/firestore"; 
import { httpsCallable } from "firebase/functions";
import { auth, db, firestore, functions } from "../../firebase/firebase";
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

export async function calcSubscription(currUser, userLeave = false) {
  auth.onAuthStateChanged(user => {
      if(user && currUser.room) {
        const prevCurrUserRoom = currUser.room

        onSnapshot(doc(firestore, "customers", `${prevCurrUserRoom}`), (snap) => {
            const leadStripeId = snap.data().stripeId

            const getList = httpsCallable(functions, "getSubscriptions");
            getList({customerId: leadStripeId})
            .then(res => { 
              const subscriptionId = res.data.data[0].id 
              onValue(ref(db, `rooms/${prevCurrUserRoom}/members`), async (snapshot) => {
                const data = snapshot.val()
                if(data)
                {
                  const usersNumber = Object.values(data).length - userLeave

                  const updateSubscription = httpsCallable(functions, "updateSubscription")
                  updateSubscription({subscriptionId: subscriptionId, usersNumber: usersNumber})
                  .then(res => console.log(res))
                  .catch(e => console.log(e))
                }
                else return null
              })
            })
            .catch(e => console.log(e))
        })
      }
  })
}

async function getsubscriptionId(leadStripeId) {
  const getList = httpsCallable(functions, "getSubscriptions");

  return await getList({customerId: leadStripeId})
  .then(res => res.data.data[0].id )
}

export async function cancelSubscription(currUser) {

  const userRoom = currUser.room
  
  const path = doc(firestore, "customers", `${userRoom}`)

  const docSnap = await getDoc(path)

  if (!docSnap.exists || docSnap.data() === undefined) {
    console.log('No such document!');
    return null
  } else {

    const leadStripeId = docSnap.data()?.stripeId

    const subscriptionId = await getsubscriptionId(leadStripeId)

    const updateSubscription = httpsCallable(functions, "updateSubscription")
    
    return {"firebase backend": await updateSubscription({subscriptionId: subscriptionId, cancelSubscription: true})}

  }
}