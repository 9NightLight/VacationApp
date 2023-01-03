import React from 'react'
import { ref, update } from 'firebase/database';
import { db } from '../../firebase/firebase';
import { CalendarContext } from '../../Home';

export default function RefreshWindow({show, setShow}) {
    const { roomUsers, currUser, defaultNumVacations } = React.useContext(CalendarContext)

    const onRefresh = () => {
        roomUsers.map(val => {
            update(ref(db, `rooms/${currUser.room}/members/${val.uuid}/`), {vacationsNum: defaultNumVacations})
            .then(update(ref(db, `users/${val.uuid}/`), {vacationsNum: defaultNumVacations}))
            .then(setShow(false))
        })
    }

    return (
        <React.Fragment>
            {show ? 
                <div>
                    <div className='absolute w-full h-full left-0 top-0 flex justify-center items-center'>
                        <div className=' w-192 h-80 z-50 bg-white text-black rounded-xl flex flex-col items-center justify-between'>
                            <div className=' text-3xl mt-10 font-semibold'>Set vacation allowance to {defaultNumVacations} days for everyone?</div>
                            <div className='w-full flex justify-around mb-4'>
                                <button onClick={() => setShow(false)} className='w-2/5 h-16 font-semibold  rounded-xl border-gray-500 border active:shadow-lg active:shadow-gray-400'>Cancel</button>
                                <button onClick={onRefresh} className='w-2/5 h-16 font-semibold bg-blue-500 rounded-xl text-white active:shadow-lg active:shadow-blue-400'>Continue</button>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => setShow(false)} className='absolute z-20 w-full h-full left-0 top-0 bg-gray-700/50' />
                </div>
                : ""
            }
        </React.Fragment>
    )
}
