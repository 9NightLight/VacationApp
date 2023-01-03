import { auth } from "../../firebase/firebase";

export async function isUserPremium() {
    await auth.currentUser?.getIdToken(true)
    const decodedToken = await auth.currentUser?.getIdTokenResult()

    return decodedToken?.claims?.stripeRole ? true : false;
}