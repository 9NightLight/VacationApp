import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { httpsCallable } from "firebase/functions";
import { functions } from '../../firebase.js';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log("Stripe 23 | token generated!", paymentMethod);
      try {
        const addMessage = httpsCallable(functions, 'procceedPayment');

        const { id } = paymentMethod;
        const response = await addMessage({amount: 999, id: id})
        console.log(response)
        // addMessage({amount: 999, id: id})
        // .then(res => console.log("CheckoutForm.js 25 | response", res))
        // .catch(err => console.log("CheckoutForm.js 26 | err", err))
        // axios.post(
        //   "http://localhost:8080/stripe/charge",
        //   {
        //     amount: 999,
        //     id: id,
        //   }
        // );

        // console.log("Stripe 35 | data", response.data.success);
        // if (response.data.success) {
        //   console.log("CheckoutForm.js 25 | payment successful!");
        // }
      } catch (error) {
        console.log("CheckoutForm.js 28 | ", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ml-40 mt-10 w-96 h-40 bg-purple-200 shadow-2xl rounded-sm p-2">
      <CardElement className="bg-white h-8 p-2"/>
      <div className="w-full flex justify-end">
        <button className="w-20 h-8 bg-white rounded-md mt-10 font-bold">Pay</button>
      </div>
    </form>
  );
};