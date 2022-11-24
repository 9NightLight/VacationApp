import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_51LvIkhFlIMqx6x2711SpIi218jZPjopxmA7Gr4WoexWk5TGkipcEFkUp5cEifIBt5dFhIrcI9xpEws2vje2di0LM00tgt9W5pB");
  }
  return stripePromise;
};
