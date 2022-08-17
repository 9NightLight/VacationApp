import React from 'react'
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth, db } from '../firebase.js';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export const ROLES = {
    EMPLOYER: "Employer",
    HRMANAGER: "HR Manager"
}

export default function SignIn() {
    const FirstNameRef = React.useRef();
    const LastNameRef = React.useRef();
    const EmailRef = React.useRef();
    const PasswordRef = React.useRef();
    const [showRegister, setShowRegister] = React.useState(false);
    const [showInvalidData, setShowInvalidData] = React.useState(false);
    const navigate = useNavigate();
    ///
    const [email, setEmail] = React.useState(
        window.localStorage.getItem("emailForSignIn") || ""
    );

    React.useEffect(() => {
        const saved_email = window.localStorage.getItem("emailForSignIn");

        // Verify the user went through an email link and the saved email is not null
        if (isSignInWithEmailLink(auth, window.location.href) && !!email) {
            // Sign the user in
            signInWithEmailLink(auth, saved_email, window.location.href)
            .then(console.log("I sign in new user"))
            .catch(err => console.log(err))
            .then(navigate("/"))
        }
    }, [])

    const updateEmail = (e) => {
        setEmail(e.target.value);
    };

    const trySignIn = async (e) => {
        e.preventDefault();
        const saved_email = window.localStorage.getItem("emailForSignIn");
        console.log(isSignInWithEmailLink(auth, email))
        if (isSignInWithEmailLink(auth, email) && !!email) {
            signInWithEmailLink(auth, email, window.location.href).catch((err) => {
            switch (err.code) {
                default:
                    setShowInvalidData(true);
            }
            });
        } else {
            sendSignInLinkToEmail(auth, email, {
                url: "http://localhost:3000/auth",
                handleCodeInApp: true,
            })
            .then(() => {
                // Save the users email to verify it after they access their email
                window.localStorage.setItem("emailForSignIn", email);
            })
            .catch((err) => {
                console.log(err)
                switch (err.code) {
                default:
                    setShowInvalidData(true);
                }
            });
        }
    };

    // const handleSignIn = (e) => {
    //     e.preventDefault();
    //     signInWithEmailAndPassword(auth, EmailRef.current.value, PasswordRef.current.value)
    //     .catch(err => setShowInvalidData(true))
    // }

    // const writeUsers = () => {
    //     auth.onAuthStateChanged(user => {
    //         if(user)
    //         {
    //             const uuid = user.uid;
    //             let str = EmailRef.current.value;
    //             set(ref(db, `/users/${uuid}`), {
    //                 firstName: FirstNameRef.current.value,
    //                 lastName: LastNameRef.current.value,
    //                 vacationsNum: 10,
    //                 role: ROLES.HRMANAGER,
    //                 email: str.toLowerCase(),
    //                 room: uuid,
    //                 uuid: uuid,
    //             })
    //             .then(set(ref(db, `/rooms/${uuid}/members/${uuid}`), { firstName: FirstNameRef.current.value,
    //                                                                     lastName: LastNameRef.current.value,
    //                                                                     vacationsNum: 10,
    //                                                                     role: ROLES.HRMANAGER,
    //                                                                     email: str.toLowerCase(),
    //                                                                     uuid: uuid,}))
    //             .then(set(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10}))
    //         }
    //     })
    // } 

    // const handleCreate = (e) => {
    //     e.preventDefault();
    //     createUserWithEmailAndPassword(auth, EmailRef.current.value, PasswordRef.current.value)
    //     .then(writeUsers)
    //     .catch(err => setShowInvalidData(true))
    // }

    return (
        <React.Fragment>
            {
            <div className='absolute left-0 top-0 w-full h-full bg-blue-200 z-10 flex justify-center items-center'>
                <div className="z-20 w-96 h-120 bg-white flex flex-col justify-between rounded-xl shadow-xl">
                    {/* { !showRegister ?
                        <form onSubmit={handleSignIn} autoComplete="on">
                            <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                                Sign in
                            </div>
                            <div className='relative w-5/6 h-fit ml-10'>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Email</label>
                                    <input type="email" autoComplete='email' name='email' ref={EmailRef} placeholder="example.example.com" className='absolute right-0 border-2'></input>                                            
                                </div>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Password</label>
                                    <input type="password" autoComplete='current-password' name='password' ref={PasswordRef} placeholder="Password" className='absolute right-0 border-2'></input>
                                </div>
                            </div>
                            <div className="w-full h-40 flex flex-col justify-center items-center">
                                <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Sign in</button>
                                <button onClick={() => (setShowRegister(true), EmailRef.current.value ="", PasswordRef.current.value ="", setShowInvalidData(false))} className="w-44 h-6 bg-red-400 rounded-xl mt-2 text-sm">Create an account</button>
                                {showInvalidData ? <div className='text-red-400 text-sm'>Invalid data</div> : ""}
                            </div>
                        </form>
                        : */}
                        <React.Fragment>
                            <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                                Create an account
                            </div>
                            <div className='relative w-5/6 h-fit ml-10'>
                                {/* <div className="w-full h-20 flex justify-around flex-col">
                                    <div>
                                        <label className='font-bold'>First name</label>
                                        <input type="text" autoComplete='given-name' name='firstname' ref={FirstNameRef} placeholder="Daniel Grey" className='absolute right-0 border-2'></input>       
                                    </div>
                                    <div>
                                        <label className='font-bold'>Last name</label>
                                        <input type="text" autoComplete='family-name' name='firstname' ref={LastNameRef} placeholder="Daniel Grey" className='absolute right-0 border-2'></input>                                         
                                    </div>
                                </div> */}
                                <form onSubmit={trySignIn} autoComplete="on">
                                    <div className="w-full h-20 flex justify-start items-center">
                                        <label className='font-bold'>Email</label>
                                        <input type="email" autoComplete='email' name='email' value={email} onChange={updateEmail} placeholder="example.example.com" className='absolute right-0 border-2'></input>
                                        {/* <input type="email" autoComplete='email' name='email' ref={EmailRef} placeholder="example.example.com" className='absolute right-0 border-2'></input>                         */}
                                    </div>
                                    {/* <div className="w-full h-20 flex justify-start items-center">
                                        <label className='font-bold'>Password</label>
                                        <input type="password" autoComplete='new-password' name='password' ref={PasswordRef} placeholder="Password" className='absolute right-0 border-2'></input>
                                    </div> */}
                                    <div className="w-full h-40 flex flex-col justify-center items-center">
                                        <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Create</button>
                                        {/* <button onClick={() => (setShowRegister(false), EmailRef.current.value ="", PasswordRef.current.value ="", setShowInvalidData(false))} className="w-44 h-6 bg-red-400 rounded-xl mt-2 text-sm">Back to sign in</button> */}
                                        {showInvalidData ? <div className='text-red-400 text-sm'>Invalid data</div> : ""}
                                    </div>
                                </form>
                            </div>
                        </React.Fragment>
                    {/* } */}
                </div>
            </div>
        }
        </React.Fragment>
    )
}
