import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from '../../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { CalendarContext } from '../../Home';

export default function VacationsAsk({vacation, setVacations, vacations}) {
    const [vacationOwner, setVacationOwner] = React.useState(new Array([]))
    const [vacationOwnerName, setVacationOwnerName] = React.useState("")
    const [blockRefuse, setBlockRefuse] = React.useState(false)
    const {currUser, roomUsers, setRoomUsers} = React.useContext(CalendarContext)

    const countDelta = () => {
        const sD = new Date(vacation.startDate);
        sD.setHours(0, 0, 0, 0);
        const eD = new Date(vacation.endDate);
        eD.setHours(0, 0, 0, 0);
        
        let a = 0;
        let dd = sD
        let counter = 0;
        do {
            dd = new Date(dd.setDate((dd.getDate() + a)))
            if(dd.getDay() !== 6 && dd.getDay() !== 0) counter++
            a = 1
        } while(dd.getTime() !== eD.getTime())

        let oUser = null;
        onValue(ref(db, `/rooms/${currUser.room}/members`), (snapshot) => {
            let rUsers = new Array();
            const data = snapshot.val()
            if(data !== null)
            {
                Object.values(data).map((val)=> {
                    rUsers = [...rUsers, val]
                })
                rUsers.sort(((a, b) => {
                    let fa = a.firstName.toLowerCase() + a.lastName.toLowerCase(),
                        fb = b.firstName.toLowerCase() + b.lastName.toLowerCase();
                    return fa < fb ? -1 : fa > fb ? 1 : 0;
                }));
                setRoomUsers(rUsers);
                oUser = rUsers.find(val => {return val.uuid === vacation.uuid})
            }
        })
        return oUser !== null ? oUser.vacationsNum + counter : null;
    }

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                setVacationOwner(roomUsers.find(val => {return val.uuid === vacation.uuid}))
            }
        })
        
    }, [ , roomUsers])

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                let a = vacationOwner.lastName + ", " + vacationOwner.firstName
                setVacationOwnerName(a.length > 20 ? a.slice(0, 20) : a)
            }
        })
    }, [vacationOwner])

    const getFormatedDate = (date) => {
        return (new Date(date).getDate() < 10 ? "0" + new Date(date).getDate() : new Date(date).getDate()) + "-" + (new Date(date).getMonth() < 10 ? "0" + (new Date(date).getMonth() + 1) : (new Date(date).getMonth() + 1)) + "-" + new Date(date).getFullYear()
    }

    const onEventConfirm = (e) => {
        e.preventDefault()
        auth.onAuthStateChanged(user => {
            if(user)
            {
                set(ref(db, `rooms/${currUser.room}/events/confirmed/${vacation.eventUID}`), {
                    type: vacation.type,
                    description: vacation.description,
                    startDate: vacation.startDate,
                    endDate: vacation.endDate,
                    uuid: vacation.uuid,
                    eventUID: vacation.eventUID,
                    })

                remove(ref(db, `rooms/${currUser.room}/events/pending/${vacation.eventUID}`))

                let arr = new Array()
                vacations.map(val => {
                if(val.eventUID !== vacation.eventUID) {arr = [...arr, val]}
                })
                setVacations(arr)
            }
        })
    }

    const onEventRefuse = (e) => {
        e.preventDefault()
        auth.onAuthStateChanged(user => {
            if(user)
            {
                setBlockRefuse(true)
                const k = countDelta()
                update(ref(db, `rooms/${currUser.room}/members/${vacationOwner.uuid}`), {vacationsNum: k}) 
                .then(
                    update(ref(db, `users/${vacationOwner.uuid}/`), {vacationsNum: k}) 
                    .then(
                        remove(ref(db, `rooms/${currUser.room}/events/pending/${vacation.eventUID}`))
                        .then(() => {
                            let arr = new Array()
                            vacations.map(val => {
                                if(val.eventUID !== vacation.eventUID) {arr = [...arr, val]}
                            })
                            setVacations(arr)
                            }
                        )
                        .then(() => {
                            const time = setTimeout(setBlockRefuse(false), 1000);
                        })
                    )
                )
            }
        })
    }


    return (
        <div>
            <div className='sm:w-120 w-80 h-8 flex justify-between items-center mb-1'>
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
                    <button type="submit">
                    <FontAwesomeIcon className='text-3xl text-green-apple' icon={faCircleCheck} />
                    </button>
                </form>
                <form onSubmit={onEventRefuse}>
                    <button type={blockRefuse ? "button" : !blockRefuse ? 'submit' : "err"}>
                    <FontAwesomeIcon className='text-3xl text-red-500' icon={faCircleXmark} />
                    </button>
                </form>
                </div>
            </div>
        </div>
    )
}
