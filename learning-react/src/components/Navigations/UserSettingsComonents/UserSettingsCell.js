import React from 'react';
import { ROLES } from '../../SignIn';
import { auth, db } from '../../../firebase.js';
import { ref, update } from 'firebase/database';
import { CalendarContext } from '../../../Home';


export default function UserSettingsCell({user}) {
    const {currUser} = React.useContext(CalendarContext)
    const vacationsNumRef = React.useRef()

    const handleVacationNumChange = () => {
        console.log(vacationsNumRef.current.value)
        if(vacationsNumRef.current.value !== "")
        {
            auth.onAuthStateChanged(u => {
                update(ref(db, `/users/${user.uuid}`), {
                    vacationsNum: vacationsNumRef.current.value
                })
            })
        }
    }

    return (
        <div>
            {
            currUser.role === ROLES.EMPLOYER ? 
                <input type="text" className='w-6 bg-gray-200 opacity-100 text-center text-black' placeholder={user.vacationsNum} ref={vacationsNumRef} onBlur={handleVacationNumChange} readOnly></input>
                : currUser.role === ROLES.HRMANAGER ?
                <input type="text" className='w-6 bg-gray-200 opacity-100 text-center text-black' placeholder={user.vacationsNum} ref={vacationsNumRef} onBlur={handleVacationNumChange}></input>
                : <div>Err</div>
            }
        </div>
    )
}
