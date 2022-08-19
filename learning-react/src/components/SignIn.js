import React from 'react'
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth, db } from '../firebase.js';
import { onValue, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { SelectAllTwoTone } from '@mui/icons-material';

export const ROLES = {
    EMPLOYER: "Employer",
    HRMANAGER: "HR Manager"
}

export default function SignIn() {
    const FirstNameRef = React.useRef();
    const LastNameRef = React.useRef();
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
        console.log("Createing new account")
        if (isSignInWithEmailLink(auth, email) && !!email) {
            signInWithEmailLink(auth, email, window.location.href)
            .catch((err) => {
            switch (err.code) {
                default:
                    setShowInvalidData(true);
            }
            });
        } else {
            console.log("Createing new account")
            sendSignInLinkToEmail(auth, email, {
                url: "https://civil-planet-357119.uc.r.appspot.com/auth",
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
            debugger;
            signInWithEmailLink(auth, saved_email, window.location.href)
            .then(writeUsers())
            // .then(navigate("/"))
            .catch(err => {setShowInvalidData(true); console.log(err); console.log("68: Error")})
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
        debugger;
        const saved_email = window.localStorage.getItem("emailForSignIn");
        auth.onAuthStateChanged(user => {
            console.log(user)
            if(user)
            {
                const uuid = user.uid;
                let str = saved_email;
                set(ref(db, `/users/${uuid}`), {
                    firstName: FirstNameRef.current.value,
                    lastName: LastNameRef.current.value,
                    vacationsNum: 10,
                    role: ROLES.HRMANAGER,
                    email: str.toLowerCase(),
                    room: uuid,
                    uuid: uuid,
                })
                .then(set(ref(db, `/rooms/${uuid}/members/${uuid}`), { firstName: FirstNameRef.current.value,
                                                                        lastName: LastNameRef.current.value,
                                                                        vacationsNum: 10,
                                                                        role: ROLES.HRMANAGER,
                                                                        email: str.toLowerCase(),
                                                                        uuid: uuid,}))
                .then(set(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10}))
            }
        })
    } 

    return (
        <React.Fragment>
            {
            <div className='absolute left-0 top-0 w-full h-full bg-blue-200 z-10 flex justify-center items-center'>
                <div className="z-20 w-96 h-fit bg-white flex flex-col rounded-xl shadow-xl">
                {isSignInWithEmailLink(auth, window.location.href) && !!email ? 
                    <React.Fragment>
                        <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                            Last step
                        </div>
                        <div className='relative w-5/6 h-fit ml-10'>
                            <form onSubmit={completeSignIn} autoComplete="on">
                                <div className="w-full h-20 flex justify-around flex-col">
                                    <div>
                                        <label className='font-bold'>First name</label>
                                        <input type="text" autoComplete='given-name' name='firstname' ref={FirstNameRef} required placeholder="Daniel Grey" className='absolute right-0 border-2'></input>       
                                    </div>
                                    <div>
                                        <label className='font-bold'>Last name</label>
                                        <input type="text" autoComplete='family-name' name='firstname' ref={LastNameRef} required placeholder="Daniel Grey" className='absolute right-0 border-2'></input>                                         
                                    </div>
                                </div>
                                <div className="w-full h-40 flex flex-col justify-center items-center">
                                    <button type={allow ? 'submit' : 'button' } className="w-24 h-10 bg-green-apple rounded-xl">Create</button>
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
                                    <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Create</button>
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
