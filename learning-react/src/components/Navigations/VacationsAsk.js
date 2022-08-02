import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { CalendarContext } from '../../Home';

export default function VacationsAsk({vacation}) {
    const [vacationOwner, setVacationOwner] = React.useState()
    const {currUser} = React.useContext(CalendarContext)

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                onValue(ref(db, `rooms/${currUser.room}/members`), (snapshot) => {
                    const data = snapshot.val()
                    if(data !== null) {
                        Object.values(data).map((val) => {
                            if(val.uuid === vacation.uuid) {setVacationOwner(val)}
                        })
                    }
                })
            }
        })
    }, [])

    const getSliceName = (firstName, lastName) => {
        let a = lastName + ", " + firstName;
        return a.length > 20 ? a.slice(0, 20) : a;
    }

    const getFormatedDate = (date) => {
        return new Date(date).getDate() + "-" + new Date(date).getMonth() + "-" + new Date(date).getFullYear()
    }

  return (
    <div>
        <div className='w-96 h-8 flex justify-between items-center mb-1'>
            <div className='flex justify-between w-full pr-4'>
                <div className='font-bold'>{getSliceName(vacationOwner.firstName, vacationOwner.lastName)}</div>
                {
                vacation.startDate === vacation.endDate ? <div className='font-bold'>{`\t${getFormatedDate(vacation.startDate)}`}</div> : 
                    <div className='flex'>
                        <div className='font-bold'>{`\t${getFormatedDate(vacation.startDate)}`}</div>
                        <div className='mr-2 ml-2'>to</div>
                        <div className='font-bold'>{`${getFormatedDate(vacation.endDate)}`}</div>
                    </div>
                }
            </div>
            <div className='w-20 flex justify-between'>
            <form>
                <button type='submit'>
                <FontAwesomeIcon className='text-3xl text-green-apple' icon={faCircleCheck} />
                </button>
            </form>
            <form>
                <button type='submit'>
                <FontAwesomeIcon className='text-3xl text-red-500' icon={faCircleXmark} />
                </button>
            </form>
            </div>
        </div>
    </div>
  )
}
