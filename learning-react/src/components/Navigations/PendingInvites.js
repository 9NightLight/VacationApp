import { onValue, ref, remove } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { CalendarContext } from '../../Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons"

export default function PendingInvites () {
  const [pendingUsers, setPendingUsers] = useState(new Array(null));
  const {currUser} = React.useContext(CalendarContext)
  const [show, setShow] = React.useState(false)

  useEffect(() => {
    onValue(ref(db, `/rooms/${currUser.room}/pending/emailArray/`), snapshot => {
        const users = snapshot.val();
        setPendingUsers(users);
    })
  }, [currUser.room]);

  const handleDelete = _email => {
    console.log(_email)
    onValue(ref(db, `/rooms/${currUser.room}/pending/emailArray/`), snapshot => {
        const users = snapshot.val();

        const pendingIdx = Object.values(users).map((email, idx) => {
            if(email == _email) return idx
        })

        remove(ref(db, `/rooms/${currUser.room}/pending/emailArray/${pendingIdx}`))
        .then(
            onValue(ref(db, `/rooms/${currUser.room}/pending/emailArray/`), snapshot => {
            const users = snapshot.val();
            setPendingUsers(users);
        }))
    })
  };

  return (

    <React.Fragment>
        <div className='font-bold text-2xl mb-4'>Pending invites</div>
        {pendingUsers ? pendingUsers.map(userEmail => (
        <div>
            <div className='sm:w-120 w-80 h-8 flex justify-between items-center mb-1'>
                <div className='flex'>
                    <div className='font-bold'>{ userEmail }</div>
                    <div className='ml-2'> invited</div>
                </div>
                <div className='w-18'>
                    <button onClick={() => setShow(true)}>
                    <FontAwesomeIcon className='text-3xl text-red-500' icon={faCircleXmark} />
                    </button>
                </div>
            </div>
       

            {show ? 
            <div className='absolute w-full h-full left-0 top-0 flex justify-center items-center'>
            <div className=' w-192 h-80 z-50 bg-white text-black rounded-xl flex flex-col items-center justify-between'>
                <div className=' text-3xl mt-10 font-semibold'>Do you want to cancel the invite?</div>
                <div className='w-full flex justify-around mb-4'>
                    <button onClick={() => setShow(false)} className='w-2/5 h-16 font-semibold  rounded-xl border-gray-500 border active:shadow-lg active:shadow-gray-400'>Cancel</button>
                    <button onClick={() => handleDelete(userEmail)} className='w-2/5 h-16 font-semibold bg-red-500 rounded-xl text-white active:shadow-lg active:shadow-blue-400'>Confirm</button>
                </div>
                </div>
                <div onClick={() => {
                    setShow(false)
                }} className='absolute z-20 w-full h-full left-0 top-0 bg-gray-700/50' />        
            </div>
            : ""
            }
        </div>
        )) : 
            <div className='sm:w-120 w-80 h-8 flex justify-between items-center mb-1'>
                <div className='ml-2 text-gray-500/50'>You don't have pending accounts</div>
            </div>
            }
    </React.Fragment>
  );
};