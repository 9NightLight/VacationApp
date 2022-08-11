import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate} from "@fortawesome/free-solid-svg-icons"
import React from 'react';
import { CalendarContext } from '../../Home';
import UserSettingsCell from './UserSettingsCell';
import { onValue, ref, update } from 'firebase/database';
import { db } from '../../firebase';
import { ROLES } from '../SignIn';

export default function UsersSettings() {
    const { roomUsers, currUser, defaultNumVacations } = React.useContext(CalendarContext)

    const onRefresh = () => {
        roomUsers.map(val => {
            update(ref(db, `rooms/${currUser.room}/members/${val.uuid}/`), {vacationsNum: defaultNumVacations})
            .then(update(ref(db, `users/${val.uuid}/`), {vacationsNum: defaultNumVacations}))
        })
    }

    return (
        <React.Fragment>
            <div className='w-192 h-fit bg-main-gray text-gray-100'>
                <div className='relative h-6 flex justify-between font-bold'>
                    <div className='w-fit h-full ml-8'> 
                        <div>User</div>
                    </div>
                    <div className='relative h-full w-60 flex justify-between mr-8'>
                        <div>Role</div>
                        <div className='flex w-full h-6 justify-end ml-3'>
                            <div>Vacations</div>
                            { currUser.role === ROLES.HRMANAGER ? 
                                <div onClick={onRefresh} className='w-6 h-6 bg-white flex justify-center items-center ml-2 rounded-full cursor-pointer' title='Refresh vacations'>
                                    <FontAwesomeIcon className='w-4 h-4 flex text-center justify-center items-center text-black' icon={faArrowsRotate} />
                                </div>
                                : <div className='w-3 h-3'></div>
                            }
                        </div>
                    </div>
                </div>
                <hr className='mt-1 mb-1 bg-gray-100 opacity-25'></hr>
                {
                    roomUsers.map((val, idx) => {
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
