import React from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
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
    const navigate = useNavigate();
    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                navigate("/");
            }
            else if(!user){
                navigate("/auth");
            }
        })
    }, [])

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, EmailRef.current.value, PasswordRef.current.value)
        .catch(err => console.log(err))
    }

    const writeName = () => {
        auth.onAuthStateChanged(user => {
            const uuid = user.uid;
            let str = EmailRef.current.value; 
            str.toLowerCase()
            set(ref(db, `/users/${uuid}`), {
                firstName: FirstNameRef.current.value,
                lastName: LastNameRef.current.value,
                vacationsNum: 10,
                role: ROLES.EMPLOYER,
                email: str.toLowerCase(),
                uuid: uuid,
            })
            set(ref(db, `/rooms/${uuid}`), {
                email: str.toLowerCase(),
                uuid: uuid,
            })
        })
    } 

    const handleCreate = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, EmailRef.current.value, PasswordRef.current.value)
        .then(writeName)
        .catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            {
            <div className='absolute left-0 top-0 w-full h-full bg-blue-200 z-10 flex justify-center items-center'>
                <div className="z-20 w-96 h-120 bg-white flex flex-col justify-between rounded-xl shadow-xl">
                    { !showRegister ?
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
                                <button onClick={() => (setShowRegister(true), EmailRef.current.value ="", PasswordRef.current.value ="")} className="w-44 h-6 bg-red-400 rounded-xl mt-2 text-sm">Create an account</button>
                            </div>
                        </form>
                        :
                        <React.Fragment>
                            <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                                Create an account
                            </div>
                            <div className='relative w-5/6 h-fit ml-10'>
                                <div className="w-full h-20 flex justify-around flex-col">
                                    <div>
                                        <label className='font-bold'>First name</label>
                                        <input type="text" autoComplete='given-name' name='firstname' ref={FirstNameRef} placeholder="Daniel Grey" className='absolute right-0 border-2'></input>       
                                    </div>
                                    <div>
                                        <label className='font-bold'>Last name</label>
                                        <input type="text" autoComplete='family-name' name='firstname' ref={LastNameRef} placeholder="Daniel Grey" className='absolute right-0 border-2'></input>                                         
                                    </div>
                                </div>
                                <form onSubmit={handleCreate} autoComplete="on">
                                    <div className="w-full h-20 flex justify-start items-center">
                                        <label className='font-bold'>Email</label>
                                        <input type="email" autoComplete='email' name='email' ref={EmailRef} placeholder="example.example.com" className='absolute right-0 border-2'></input>                        
                                    </div>
                                    <div className="w-full h-20 flex justify-start items-center">
                                        <label className='font-bold'>Password</label>
                                        <input type="password" autoComplete='new-password' name='password' ref={PasswordRef} placeholder="Password" className='absolute right-0 border-2'></input>
                                    </div>
                                    <div className="w-full h-40 flex flex-col justify-center items-center">
                                        <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Create</button>
                                        <button onClick={() => (setShowRegister(false), EmailRef.current.value ="", PasswordRef.current.value ="")} className="w-44 h-6 bg-red-400 rounded-xl mt-2 text-sm">Back to sign in</button>
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
