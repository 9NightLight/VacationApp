import React from 'react';
import { CalendarContext } from '../../Home';
import { auth, db } from '../../firebase.js';
import { ref, update } from 'firebase/database';
import { ROLES } from '../SignIn';
import UserSettingsCell from './UserSettingsComonents/UserSettingsCell';

export default function UsersSettings() {
    const {users, currUser} = React.useContext(CalendarContext)
    const vacationsNumRef = React.useRef()

    const handleVacationNumChange = () => {
        if(vacationsNumRef.current.value !== "")
        {
            auth.onAuthStateChanged(user => {
                const uuid = user.uid;
                update(ref(db, `/users/${users.uuid}`), {
                    vacationsNum: vacationsNumRef.current.value
                })
            })
        }
    }

    return (
        <React.Fragment>
            <div className='w-192 h-fit bg-main-gray text-gray-100'>
                <div className='relative flex justify-between font-bold'>
                    <div className='w-fit ml-8'> 
                        <div>User</div>
                    </div>
                    <div className='relative w-56 flex justify-between mr-8'>
                        <div>Role</div>
                        <div>Vacations</div>
                    </div>
                </div>
                <hr className='mt-1 mb-1 bg-gray-100 opacity-25'></hr>
                {
                    users.map((val, idx) => {
                        let u = val.lastName + ", " + val.firstName;
                        if(u.length > 20) 
                        {
                            u = u.slice(0,20);
                        }
                        return <React.Fragment key={idx}>
                            <div className='relative w-full h-6 flex justify-between mt-1'>
                                <div className='w-fit ml-8'> 
                                    <div>{u}</div>
                                </div>
                                <div className='relative w-56 flex justify-between mr-16'>
                                    <div className='ml-4'>{val.role}</div>
                                    <div>
                                        <UserSettingsCell user={val}/>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    })
                }
            </div>
        </React.Fragment>
    )
}
