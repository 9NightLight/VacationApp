import React from 'react';
import { ROLES } from '../../components/Registation/SignIn';
import { auth, db } from '../../firebase/firebase.js';
import { ref, update } from 'firebase/database';
import { CalendarContext } from '../../Home';


export default function UserVacateDays({user}) {
    const {currUser} = React.useContext(CalendarContext)
    const vacationsNumRef = React.useRef()

    const handleVacationNumChange = () => {
        auth.onAuthStateChanged(_user => {
            if(_user)
            {
                if(vacationsNumRef.current.value !== "" && !isNaN(Number(vacationsNumRef.current.value)))
                {
                    update(ref(db, `/users/${user.uuid}`), {
                        vacationsNum: Number(vacationsNumRef.current.value)
                    })
                    .then(update(ref(db, `/rooms/${currUser.room}/members/${user.uuid}`), {
                        vacationsNum: Number(vacationsNumRef.current.value)
                    }))
                    .then(vacationsNumRef.current.value = "")
                } 
                else 
                {
                    vacationsNumRef.current.value = ""
                }
            }
        })
    }

    return (
        <div>
            {
            currUser.role === ROLES.EMPLOYER ? 
                <input type="text" className='w-6 bg-gray-200 opacity-100 text-center text-black' placeholder={user.vacationsNum} ref={vacationsNumRef} onBlur={handleVacationNumChange} readOnly></input>
                : currUser.role === ROLES.HRMANAGER || currUser.role === ROLES.ADMIN ?
                <input type="text" className='w-6 bg-gray-200 opacity-100 text-center text-black' placeholder={user.vacationsNum} ref={vacationsNumRef} onBlur={handleVacationNumChange}></input>
                : <div>Err</div>
            }
        </div>
    )
}
