import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { CalendarContext } from '../../Home';

export default function VacationsAsk({vacation, setVacations, vacations, submitAllow}) {
    const [vacationOwner, setVacationOwner] = React.useState(new Array([]))
    const [vacationOwnerName, setVacationOwnerName] = React.useState("")
    const {currUser, roomUsers} = React.useContext(CalendarContext)
    // const [submitAllow, setSubmitAllow] = React.useState(false)

    const getNewVacationsNum = () => {
        const sD = new Date(vacation.startDate);
        sD.setHours(0, 0, 0, 0);
        const eD = new Date(vacation.endDate);
        eD.setHours(0, 0, 0, 0);
        // console.log(vacationOwner.vacationsNum)
        // console.log(vacationOwner.vacationsNum + (Math.ceil((sD - eD) / (1000 * 3600 * 24)) - 1))
        return vacationOwner.vacationsNum + (Math.ceil((sD - eD) / (1000 * 3600 * 24)) - 1)
    }

    React.useEffect(() => {
        setVacationOwner(roomUsers.find(val => {return val.uuid === vacation.uuid}))
    }, [])

    React.useEffect(() => {
        let a = vacationOwner.lastName + ", " + vacationOwner.firstName
        setVacationOwnerName(a.length > 20 ? a.slice(0, 20) : a)
    }, [vacationOwner])

    const getFormatedDate = (date) => {
        return new Date(date).getDate() + "-" + new Date(date).getMonth() + "-" + new Date(date).getFullYear()
    }

    const onEventConfirm = (e) => {
        e.preventDefault()
        set(ref(db, `rooms/${currUser.room}/events/confirmed/${vacation.eventUID}`), {
                                                                    type: vacation.type,
                                                                    description: vacation.description,
                                                                    startDate: vacation.startDate,
                                                                    endDate: vacation.endDate,
                                                                    uuid: vacation.uuid,
                                                                    eventUID: vacation.eventUID,
                                                                    })
        update(ref(db,`users/${vacationOwner.uuid}/`), { vacationsNum: getNewVacationsNum()})
        update(ref(db,`rooms/${currUser.room}/members/${vacationOwner.uuid}/`), { vacationsNum: getNewVacationsNum()})

        remove(ref(db, `rooms/${currUser.room}/events/pending/${vacation.eventUID}`))

        let arr = new Array()
        vacations.map(val => {
            if(val.eventUID !== vacation.eventUID) {arr = [...arr, val]}
        })
        setVacations(arr)
    }

    const onEventRefuse = (e) => {
        e.preventDefault()
        remove(ref(db, `rooms/${currUser.room}/events/pending/${vacation.eventUID}`))
        let arr = new Array()
        vacations.map(val => {
            if(val.eventUID !== vacation.eventUID) {arr = [...arr, val]}
        })
        setVacations(arr)
    }


    return (
        <div>
            <div className='w-120 h-8 flex justify-between items-center mb-1'>
                <div className='flex justify-between w-full pr-4'>
                <div className='font-bold'>{vacationOwnerName}</div>
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
                <form onSubmit={onEventConfirm}>
                    <button type={submitAllow ? "submit" : "button"}>
                    <FontAwesomeIcon className='text-3xl text-green-apple' icon={faCircleCheck} />
                    </button>
                </form>
                <form onSubmit={onEventRefuse}>
                    <button type='submit'>
                    <FontAwesomeIcon className='text-3xl text-red-500' icon={faCircleXmark} />
                    </button>
                </form>
                </div>
            </div>
        </div>
    )
}
