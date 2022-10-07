import React from 'react';
import { db, auth, functions } from '../../firebase';
import { ref, set, onValue } from 'firebase/database';
import { CalendarContext } from '../../Home';
import { httpsCallable } from 'firebase/functions';

// export const STATE = {
//     UNCONFIRMED: "Unconfirmed",
//     CONFIRMED: "Confirmed"
// }

export default function AddMember({setShow}) {
    const EmailRef = React.useRef();
    const {currUser, roomUsers} = React.useContext(CalendarContext)
    const [existError, setExistError] = React.useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();

        auth.onAuthStateChanged(user => {
            if (user)
            {    
                if(EmailRef.current.value !== "")
                {
                    let str = EmailRef.current.value;
                    let pendingArr = new Array()
                    onValue(ref(db, `/rooms/${currUser.room}/pending/emailArray`), (snapshot) => {
                        const data = snapshot.val();
                        if(data !== null)
                        {
                            Object.values(data).map(() => {
                                pendingArr = data 
                            })
                        }
                    })
                    if(pendingArr.find((val) =>{return val === str.toLowerCase()}) === undefined && roomUsers.find(val => {return val.email === str.toLowerCase()}) === undefined)
                    {
                        pendingArr = [...pendingArr, str.toLowerCase()];
                        set(ref(db, `/rooms/${currUser.room}/pending/`), {
                            emailArray: pendingArr
                        })
                        .then(() => {
                            const addMessage = httpsCallable(functions, 'addMember')
                            console.log(EmailRef.current.value)
                            addMessage({to_email: EmailRef.current.value, from_firstName: currUser.firstName, from_lastName: currUser.lastName})
                            .then((result) => {
                                console.log(result.data);
                            })
                            .then(EmailRef.current.value = "")
                            .then(setExistError(false))
                            .catch((error) => {
                                console.log(`error: ${JSON.stringify(error)}`);
                            });
                            }
                        )
                        
                    }
                    else 
                    {
                        setExistError(true)
                        EmailRef.current.value = ""
                    }
                }
            }
        })
    }

    return (
        <React.Fragment>
                <div className='absolute left-0 top-0 w-full h-full bg-blue-50 z-20 flex justify-center items-center'>
                    <div className="relative z-50 w-96 h-72 bg-white flex flex-col justify-between rounded-xl shadow-xl">
                        <form onSubmit={handleSubmit}>
                            <div className='font-bold text-2xl ml-4'>Add member</div>
                            <div className='absolute flex flex-col justify-around items-center h-5/6 w-full'>
                                <div className='relative w-full flex flex-col items-center'>
                                    <input className='w-5/6 h-10 border-2' type="email" ref={EmailRef} placeholder="example@example.com"></input>
                                    {existError === false ? "" : <div className='text-red-400 text-sm'>Email already on pending</div> }
                                </div>

                                <button type='submit' className='w-1/2 h-fit p-4 bg-blue-300 rounded-xl font-semibold'>Add member</button>
                            </div>
                        </form>
                    </div>
                    <div className='z-20 w-full h-full absolute top-0 left-0' onClick={()=>setShow(false)}></div>
                </div>
        </React.Fragment>      
    )
}
