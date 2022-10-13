import React from 'react'
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth, db } from '../firebase.js';
import { onValue, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { iso_to_gcal_description } from '../utils/GoogleCalendar.js';

export const ROLES = {
    EMPLOYER: "Employee",
    HRMANAGER: "HR Manager",
    ADMIN: "Admin"
}

const DEV_PATH = {
    TEST: "http://localhost:3000/auth",
    WEB: "https://calendar.apgix.com/auth"
}

export default function SignIn() {
    const FirstNameRef = React.useRef();
    const LastNameRef = React.useRef();
    const [country, setCountry] = React.useState("ad");
    const [showInvalidData, setShowInvalidData] = React.useState(false);
    const [showSend, setShowSend] = React.useState(false);
    const [allow, setAllow] = React.useState()
    const navigate = useNavigate();
    ///
    const [email, setEmail] = React.useState(
        window.localStorage.getItem("emailForSignIn") || ""
    );

    const updateEmail = (e) => {
        setEmail(e.target.value);
    };

    const trySignIn = async (e) => {
        e.preventDefault();
        if (isSignInWithEmailLink(auth, email) && !!email) {
            signInWithEmailLink(auth, email, window.location.href)
            .catch((err) => {
            switch (err.code) {
                default:
                    setShowInvalidData(true);
            }
            });
        } else {
            sendSignInLinkToEmail(auth, email, {
                url: DEV_PATH.WEB,
                handleCodeInApp: true,
            })
            .then(() => {
                setShowSend(true)
                // Save the users email to verify it after they access their email
                window.localStorage.setItem("emailForSignIn", email);
            })
            .catch((err) => {
                switch (err.code) {
                default:
                    setShowInvalidData(true);
                }
            });
        }
    };

    const completeSignIn = (e) => {
        e.preventDefault()
        const saved_email = window.localStorage.getItem("emailForSignIn");
        if (isSignInWithEmailLink(auth, window.location.href) && !!saved_email) {
            signInWithEmailLink(auth, saved_email, window.location.href)
            .then(writeUsers())
            .catch(err => {setShowInvalidData(true); console.log(err)})
        }
    }

    React.useLayoutEffect(() => {  
        auth.onAuthStateChanged(user => {
            if(user) navigate("/")
        })
        const saved_email = window.localStorage.getItem("emailForSignIn");
        if(isSignInWithEmailLink(auth, window.location.href) && !!saved_email)
        {
            onValue(ref(db, `users/`), (snapshot) => {
                const data = snapshot.val()
                if(Object.values(data).find(val => { return val.email === saved_email}) !== undefined)
                {
                    signInWithEmailLink(auth, saved_email, window.location.href)
                    .then(setEmail(""))
                    .then(navigate("/"))
                }
            })
            setAllow(true)
        }
    }, [])

    const writeUsers = () => {
        const saved_email = window.localStorage.getItem("emailForSignIn");
        auth.onAuthStateChanged(user => {
            console.log(user)
            if(user)
            {
                const uuid = user.uid;
                let str = saved_email;
                const a = Object.values(iso_to_gcal_description).find(val => {
                    if(val.attr === country) return true
                })
                set(ref(db, `/users/${uuid}`), {
                    firstName: String(FirstNameRef.current.value).trim(),
                    lastName: String(LastNameRef.current.value).trim(),
                    vacationsNum: 10,
                    unpaidVacationDays: 0,
                    sickLeaves: 0,
                    role: ROLES.ADMIN,
                    email: str.toLowerCase().trim(),
                    room: uuid,
                    uuid: uuid,
                })
                .then(set(ref(db, `/rooms/${uuid}/members/${uuid}`), { firstName: String(FirstNameRef.current.value).trim(),
                                                                        lastName: String(LastNameRef.current.value).trim(),
                                                                        vacationsNum: 10,
                                                                        unpaidVacationDays: 0,
                                                                        sickLeaves: 0,
                                                                        role: ROLES.ADMIN,
                                                                        email: str.toLowerCase().trim(),
                                                                        uuid: uuid,}))
                .then(set(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10}))
                .then(set(ref(db, `rooms/${uuid}/settings/country`), {
                                                                        attr: a.attr,
                                                                        country: a.country
                }))
            }
        })
    } 

    const handleCountryChange = (event) => {
        setCountry(event.target.value)
    }

    return (
        <React.Fragment>
            {
            <div className='absolute left-0 top-0 w-full h-full bg-blue-200 z-10 flex justify-center items-center'>
                <div className="z-20 w-96 h-80 bg-white flex flex-col rounded-xl shadow-xl">
                {isSignInWithEmailLink(auth, window.location.href) && !!email ? 
                    <React.Fragment>
                        <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                            Last step
                        </div>
                        <div className='relative w-5/6 h-fit ml-10'>
                            <form onSubmit={completeSignIn} autoComplete="on">
                                <div className="w-full h-32 flex justify-around flex-col">
                                    <div>
                                        <label className='font-bold'>First name</label>
                                        <input type="text" autoComplete='given-name' name='firstname' ref={FirstNameRef} required placeholder="Daniel Grey" className='absolute right-0 border-2'></input>       
                                    </div>
                                    <div>
                                        <label className='font-bold'>Last name</label>
                                        <input type="text" autoComplete='family-name' name='firstname' ref={LastNameRef} required placeholder="Daniel Grey" className='absolute right-0 border-2'></input>                                         
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='font-bold'>Coutry: </div>
                                        <select onChange={(event) => handleCountryChange(event)} defaultValue={country} className="w-3/5 l-4 h-5 flex justify-center text-black items-center bg-gray-200">
                                            {
                                                Object.values(iso_to_gcal_description).map(val => {return <option value={val.attr}>{val.country}</option>})
                                            }
                                        </select>
                                        </div>
                                    </div>
                                <div className="w-full h-20 flex flex-col justify-end items-center">
                                    <button type={allow ? 'submit' : 'button' } className="w-24 h-10 bg-green-apple rounded-xl">Sign In/Up</button>
                                    {showInvalidData ? <div className='text-red-400 text-sm'>Invalid data</div> : ""}
                                </div>
                            </form>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                            Create an account
                        </div>
                        <div className='relative w-5/6 h-fit ml-10'>
                            <form onSubmit={trySignIn} autoComplete="on">
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Email</label>
                                    <input type="email" autoComplete='email' name='email' value={email} onChange={updateEmail} placeholder="example.example.com" className='absolute right-0 border-2'></input>
                                </div>
                                {showSend ? <div className='text-green-500 text-sm text-center'>Confirmation sended on email</div> : ""}
                                <div className="w-full h-40 flex flex-col justify-center items-center">
                                    <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Sign In/Up</button>
                                    {showInvalidData ? <div className='text-red-400 text-sm'>Invalid data</div> : ""}
                                    
                                </div>
                            </form>
                        </div>
                    </React.Fragment>
                    }   
                </div>
            </div>
        }
        </React.Fragment>
    )
}
