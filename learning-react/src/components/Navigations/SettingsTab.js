import React from 'react'
import { CalendarContext } from '../../Home'
import { auth, db } from '../../firebase.js';
import { ref, update } from 'firebase/database';

export default function SettingsTab() {
    const {darkTheme, setDarkTheme, currUser} = React.useContext(CalendarContext)
    const vacationsNumRef = React.useRef()

    const handleChangeDefaultVacations = () => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                if(vacationsNumRef.current.value !== "" && !isNaN(Number(vacationsNumRef.current.value)))
                {
                    console.log(Number(vacationsNumRef.current.value))
                    auth.onAuthStateChanged(u => {
                        update(ref(db, `/users/${user.uid}`), {
                            defaultVacationsNum: Number(vacationsNumRef.current.value)
                        })
                        .then(update(ref(db, `/rooms/${currUser.room}/members/${user.uid}`), {
                            defaultVacationsNum: Number(vacationsNumRef.current.value)
                        }))
                        .then(vacationsNumRef.current.value = "")
                    })
                } 
                else 
                {
                    vacationsNumRef.current.value = ""
                }
            }
        })
    }

    return (
        <div className='w-120 h-96 flex justify-center'>
            <div className='relative w-4/5 h-5/6 bg-main-gray rounded-xl pl-4 pr-4 pt-4 pb-4'>
                <div className='w-full h-full flex flex-col'>
                    <div className='flex items-center justify-between w-full h-10 mt-2 font-bold text-white'>
                        <div>Dark theme</div>
                        <div className={darkTheme ? 'w-12 h-6 bg-black rounded-xl flex justify-end' : 'w-12 h-6 bg-white rounded-xl flex justify-start'}>
                            <div className={darkTheme ? 'w-1/2 h-full rounded-full bg-white' : 'w-1/2 h-full rounded-full bg-black'} onClick={() => setDarkTheme(!darkTheme)}></div>
                        </div>
                    </div>
                    <div className='flex items-center justify-between w-full h-10 mt-2 font-bold text-white'>
                        <div>Default number vacations</div>
                        <input type="text" ref={vacationsNumRef} className="w-8 h-6 bg-gray-200 text-black/50 text-center" placeholder={currUser.defaultVacationsNum} onBlur={handleChangeDefaultVacations}></input>
                    </div>
                </div>
            </div>
        </div>
    )
}
