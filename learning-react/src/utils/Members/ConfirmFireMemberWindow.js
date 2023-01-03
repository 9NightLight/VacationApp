import React from 'react'
import { ref, remove, set, update } from 'firebase/database';
import { db } from '../../firebase/firebase';
import { CalendarContext } from '../../Home';
import { calcSubscription } from '../Stripe/StripeCustomFunctions';
import { iso_to_gcal_description } from '../Calendar/GoogleCalendar';
import { ROLES } from '../../components/Registation/SignIn';
import { useNavigate } from 'react-router-dom';

export default function ConfirmFireMemberWindow({show, setShow, user}) {
    const { currUser, countryAttribute} = React.useContext(CalendarContext)

    const nav = useNavigate()

    const onConfirm = () => {
        calcSubscription(currUser, true)

        const uuid = user.uuid;

        let countryName = null
        let countryAttr = null
        
        if(countryAttribute) {
            countryName = countryAttribute.country
            countryAttr = countryAttribute.attr
        }
        else {
            countryName = iso_to_gcal_description.ad.country
            countryAttr = iso_to_gcal_description.ad.attr
        }

        set(ref(db, `/users/${uuid}`), {
            firstName: user.firstName,
            lastName: user.lastName,
            vacationsNum: 10,
            unpaidVacationDays: 0,
            sickLeaves: 0,
            role: ROLES.ADMIN,
            email: user.email,
            room: uuid,
            uuid: uuid,
        })
        update(ref(db, `/rooms/${uuid}/members/${uuid}`), {  firstName: user.firstName,
                                                                lastName: user.lastName,
                                                                vacationsNum: 10,
                                                                unpaidVacationDays: 0,
                                                                sickLeaves: 0,
                                                                role: ROLES.ADMIN,
                                                                email: user.email,
                                                                uuid: uuid,})
        update(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10, isRoomActive: true})
        update(ref(db, `rooms/${uuid}/settings/country`), {
                                                                attr: countryAttr,
                                                                country: countryName
        })
        remove(ref(db, `rooms/${currUser.room}/members/${uuid}`))
        
        
        nav("/auth");
        
    }

    return (
        <React.Fragment>
            {show ? 
                <div>
                    <div className='absolute w-full h-full left-0 top-0 flex justify-center items-center'>
                        <div className=' w-192 h-80 z-50 bg-white text-black rounded-xl flex flex-col items-center justify-between'>
                            <div className=' text-3xl mt-10 font-semibold'>Do you want delete { user.firstName + ' ' + user.lastName } from the group?</div>
                            <div className='w-full flex justify-around mb-4'>
                                <button onClick={() => setShow(false)} className='w-2/5 h-16 font-semibold  rounded-xl border-gray-500 border active:shadow-lg active:shadow-gray-400'>Cancel</button>
                                <button onClick={onConfirm} className='w-2/5 h-16 font-semibold bg-red-500 rounded-xl text-white active:shadow-lg active:shadow-blue-400'>Continue</button>
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
