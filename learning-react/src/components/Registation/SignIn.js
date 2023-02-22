import React from 'react'
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth, db } from '../../firebase/firebase.js';
import { onValue, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { iso_to_gcal_description } from '../../utils/Calendar/GoogleCalendar.js';
import IconMail from "../../images/Icons/IconMail.svg"

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
        setEmail(e.target.value)
        const a = showInvalidData ? setShowInvalidData(false) : ""
    };

    const sendVerificationEmail = async () => {
        return sendSignInLinkToEmail(auth, email, {
            url: DEV_PATH.TEST,
            handleCodeInApp: true,
        })
        .then(res => res)
    }

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
            sendVerificationEmail()
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
                    study: 0,
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
                                                                        study: 0,
                                                                        role: ROLES.ADMIN,
                                                                        email: str.toLowerCase().trim(),
                                                                        uuid: uuid,}))
                .then(set(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10, isRoomActive: true}))
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
            <div className='absolute left-0 top-0 w-full h-full bg-white bg-cover z-10 flex flex-col justify-start items-center '>
                <div className='w-72 h-full'>
                {isSignInWithEmailLink(auth, window.location.href) && !!email ? 
                    <div className='pl-px pt-4'>
                        <div className='h-8 text-black font-bold'>Vacate me</div>
                        <div className="w-full h-14 flex items-center justify-start text-3xl font-bold text-gray-700">Create an account</div>
                        <div className='relative w-full h-full mt-12'>
                            <form onSubmit={completeSignIn} autoComplete="on">
                                <div className="absolute w-full h-full flex flex-col justify-start items-start mb-2">
                                    <label className='font-helventica text-gray-500 text-xs'>First name</label>
                                    <input type="text" autoComplete='given-name' name='firstname' ref={FirstNameRef} required className={!showInvalidData ? 'w-full  h-7 box-content border-b bg-white text-black focus:border-b-2 focus:border-blue-600 focus:outline-none' 
                                                                                                                                        : 'w-full box-border border-b border-red-600 bg-white text-black focus:outline-none'}></input>
                                    <label className='font-helventica text-gray-500 text-xs mt-7'>Last name</label>
                                    <input type="text" autoComplete='given-name' name='firstname' ref={LastNameRef} required className={!showInvalidData ? 'w-full h-7 box-content border-b bg-white text-black focus:border-b-2 focus:border-blue-600 focus:outline-none' 
                                                                                                                                        : 'w-full box-border border-b border-red-600 bg-white text-black focus:outline-none'}></input>
                                    
                                    <label className='font-helventica text-gray-500 text-xs mt-7'>Coutry</label>
                                    <select onChange={(event) => handleCountryChange(event)} defaultValue={country} className="w-full h-7 border-b outline-none bg-white text-black flex justify-center  items-center">
                                        {
                                            Object.values(iso_to_gcal_description).map(val => {return <option value={val.attr}>{val.country}</option>})
                                        }
                                    </select>
                                    <div className=" w-full mt-9 flex flex-col justify-center items-end">
                                        <button type='submit' className="w-20 h-8 bg-blue-600 text-white font-helventica text-xs font-bold rounded-3xl">Done</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    :
                    <div className='pl-px pt-4'>
                        <div className='h-8 text-black font-bold'>Vacate me</div>
                        {!showSend ?  
                            <React.Fragment>
                                <div className="w-full h-14 flex items-center justify-start text-4xl font-bold text-gray-700">Sign in</div>
                                <div className='relative w-full h-fit mt-12'>
                                    <form onSubmit={trySignIn} autoComplete="on">
                                        <div className="absolute w-full flex flex-col justify-start items-start mb-2">
                                            <label className=' font-helventica text-gray-500 text-xs'>Email address</label>
                                            <input type="email" autoComplete='email' name='email' value={email} onChange={updateEmail} className={!showInvalidData ? 'w-full h-fit bg-white text-black box-content border-b focus:border-b-2 focus:border-blue-600 focus:outline-none' 
                                                                                                                                                : 'w-full bg-white text-black box-border border-b border-red-600 focus:outline-none'}></input>
                                            <div hidden={!showInvalidData} className='text-red-600 text-start text-sm'>Please enter an email address.</div> 
                                        </div>
                                        
                                        <div className="w-full h-56 flex flex-col justify-center items-end">
                                            <button type='submit' className="w-20 h-8 bg-blue-600 text-white font-helventica text-xs font-bold rounded-3xl">Continue</button>
                                        </div>
                                    </form>
                                </div>
                            </React.Fragment>
                        : showSend ?
                            <React.Fragment>
                                <div className="w-full h-14 flex items-center justify-start text-3xl font-bold text-gray-700">Verify your email</div>
                                <div className='relative w-full h-fit mt-12'>
                                    <div className="absolute w-full h-40 flex flex-col justify-between items-center mb-2">
                                        <img src={IconMail} className="w-18" />
                                        <div className='text-gray-700 text-sm'>Verification email sent to your email.</div> 
                                        <button onClick={() => sendVerificationEmail()} className="w-28 h-8 bg-blue-600 text-white font-helventica text-xs font-bold rounded-3xl">Resend email</button>
                                    </div>
                                </div> 
                            </React.Fragment>
                            : <div>Oops... Try to reload the page.</div>
                        }
                    </div>
                    }
                </div>
            </div>
        }
        </React.Fragment>
  );
};