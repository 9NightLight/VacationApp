import React from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase.js';
import { ref, set } from 'firebase/database';

export default function SignIn() {
    const NameRef = React.useRef();
    const EmailRef = React.useRef();
    const PasswordRef = React.useRef();
    const [show, setShow] = React.useState(true);
    const [showRegister, setShowRegister] = React.useState(false);

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                setShow(false)
            }
            else if(user === null){
                setShow(true)
            }
        })
    }, [])

    React.useEffect(() => {
        setShow(prev => !prev)
    }, [auth])

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, EmailRef.current.value, PasswordRef.current.value)
        .catch(err => console.log(err))
    }

    const writeName = () => {
        auth.onAuthStateChanged(user => {
            const uuid = user.uid;
            set(ref(db, `/users/${uuid}`), {
                name: NameRef.current.value,
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
            { show ?
            <div className='absolute left-0 top-0 w-full h-full bg-blue-200 z-10 flex justify-center items-center'>
                <div className="z-20 w-96 h-120 bg-white flex flex-col justify-between rounded-xl shadow-xl">
                    { !showRegister ?
                        <form onSubmit={handleSignIn}>
                            <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                                Sign in
                            </div>
                            <div className='relative w-5/6 h-fit ml-10'>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Email</label>
                                    <input type="email" ref={EmailRef} placeholder="example.example.com" className='absolute right-0 border-2'></input>                        
                                </div>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Password</label>
                                    <input type="password" ref={PasswordRef} placeholder="Password" className='absolute right-0 border-2'></input>
                                </div>
                            </div>
                            <div className="w-full h-40 flex flex-col justify-center items-center">
                                <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Sign in</button>
                                <button onClick={() => (setShowRegister(true), EmailRef.current.value ="", PasswordRef.current.value ="")} className="w-44 h-6 bg-red-400 rounded-xl mt-2 text-sm">Create an account</button>
                            </div>
                        </form>
                        :
                        <form onSubmit={handleCreate}>
                            <div className="w-full h-20 flex items-center justify-start ml-2 text-2xl font-bold">
                                Create an account
                            </div>
                            <div className='relative w-5/6 h-fit ml-10'>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Name</label>
                                    <input type="text" ref={NameRef} placeholder="Daniel Grey" className='absolute right-0 border-2'></input>                        
                                </div>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Email</label>
                                    <input type="email" ref={EmailRef} placeholder="example.example.com" className='absolute right-0 border-2'></input>                        
                                </div>
                                <div className="w-full h-20 flex justify-start items-center">
                                    <label className='font-bold'>Password</label>
                                    <input type="password" ref={PasswordRef} placeholder="Password" className='absolute right-0 border-2'></input>
                                </div>
                            </div>
                            <div className="w-full h-40 flex flex-col justify-center items-center">
                                <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Create</button>
                                <button onClick={() => (setShowRegister(false), EmailRef.current.value ="", PasswordRef.current.value ="")} className="w-44 h-6 bg-red-400 rounded-xl mt-2 text-sm">Back to sign in</button>
                            </div>
                        </form>
                    }
                </div>
            </div>
            : <div></div>
        }
        </React.Fragment>
    )
}
