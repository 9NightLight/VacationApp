import React from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase.js';
import { useNavigate } from "react-router-dom";
import TransitionComponent from './TransitionComponent.js';

export default function SignIn() {
    const EmailRef = React.useRef();
    const PasswordRef = React.useRef();
    const [show, setShow] = React.useState(true);

    React.useEffect(()=> {
        auth.onAuthStateChanged(user => {
            if(user) {
                setShow(false)
            }
            else if(user === null){
                setShow(true)
            }
        })
    }, [])

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, EmailRef.current.value, PasswordRef.current.value)
        .then(()=>setShow(false))
        .catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            { show ?
            <div className='absolute left-0 top-0 w-full h-full bg-blue-200 z-10 flex justify-center items-center'>
                <div className="z-20 w-96 h-120 bg-white flex flex-col justify-between rounded-xl shadow-xl">
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
                        <div className="w-full h-20 flex justify-center items-center">
                            <button type='submit' className="w-24 h-10 bg-green-apple rounded-xl">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
            : <div></div>
        }
        </React.Fragment>
    )
}
