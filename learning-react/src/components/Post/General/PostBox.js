import React from 'react';
import { CalendarContext } from '../../../Home';
import Invites from '../Invites/Invites';
import VacationsAsk from '../Vacation/VacationRequests';
import { ROLES } from '../../Registation/SignIn';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { auth, db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { iso_to_gcal_description } from '../../../utils/Calendar/GoogleCalendar';
import PendingInvites from '../Pending/PendingAccounts';

export default function NotificationsTab({tab}) {
    const {currUser, invites, setInvites, vacations, setVacations, isRoomActive, countryAttribute} = React.useContext(CalendarContext)
    const [show, setShow] = React.useState(false)
    const nav = useNavigate()

    const leaveGroup = () => {
      auth.onAuthStateChanged(user => {
        if(user)
        {
            const uuid = user.uid;

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
              firstName: currUser.firstName,
              lastName: currUser.lastName,
              vacationsNum: 10,
              unpaidVacationDays: 0,
              sickLeaves: 0,
              role: ROLES.ADMIN,
              email: currUser.email,
              room: uuid,
              uuid: uuid,
            })
            update(ref(db, `/rooms/${uuid}/members/${uuid}`), {  firstName: currUser.firstName,
                                                                    lastName: currUser.lastName,
                                                                    vacationsNum: 10,
                                                                    unpaidVacationDays: 0,
                                                                    sickLeaves: 0,
                                                                    role: ROLES.ADMIN,
                                                                    email: currUser.email,
                                                                    uuid: uuid,})
            update(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10, isRoomActive: true})
            update(ref(db, `rooms/${uuid}/settings/country`), {
                                                                    attr: countryAttr,
                                                                    country: countryName
            })
            // remove(ref(db, `rooms/${currUser.room}/members/${currUser.uuid}`))
            
            
            nav("/auth");
            
          }
        })
    }

    return (
      <div className='ml-4 flex flex-col w-192 h-full'>
        <div className='h-fit flex flex-col mb-4'>
          <div className='font-bold text-2xl mb-4'>Invites</div>
          {
            invites.map((val, idx) => {
              return <Invites uuid={val} key={idx} invites={invites} setInvites={setInvites}/>
            })
          }
        </div>
        {(currUser.role === ROLES.HRMANAGER || currUser.role === ROLES.ADMIN) && isRoomActive === true ?
        <div>
          <div className='font-bold text-2xl mb-4'>Vacations</div>
            {
              vacations.map((val, idx) => {
                return <VacationsAsk vacation={val} key={idx} setVacations={setVacations} vacations={vacations}/>
              })
            }
            <PendingInvites />
          </div>
          : ""
        }     
        {
        isRoomActive ? ""
        : 
        <button onClick={() => setShow(true)} className='w-32 h-10 bg-red-500 text-white flex justify-center items-center font-semibold rounded-xl'>Leave group</button>
        }
        {show ? 
        <div className='absolute w-full h-full left-0 top-0 flex justify-center items-center'>
          <div className=' w-192 h-80 z-50 bg-white text-black rounded-xl flex flex-col items-center justify-between'>
            <div className=' text-3xl mt-10 font-semibold'>Do you want to leave to your own group?</div>
              <div className='w-full flex justify-around mb-4'>
                  <button onClick={() => setShow(false)} className='w-2/5 h-16 font-semibold  rounded-xl border-gray-500 border active:shadow-lg active:shadow-gray-400'>Cancel</button>
                  <button onClick={() => leaveGroup()} className='w-2/5 h-16 font-semibold bg-red-500 rounded-xl text-white active:shadow-lg active:shadow-blue-400'>Confirm</button>
              </div>
            </div>
          <div onClick={() => {
            setShow(false)
          }} className='absolute z-20 w-full h-full left-0 top-0 bg-gray-700/50' />        
        </div>
        : ""
        }
      </div>
    )
}
