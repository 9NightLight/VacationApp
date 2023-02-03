import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from '../../../firebase/firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { CalendarContext } from '../../../Home';
import {VACATION_TYPE} from "../../Calendar/CalendarParts/Features/BookVacationWindow"

export default function VacationsAsk({vacation, setVacations, vacations}) {
    const [vacationOwner, setVacationOwner] = React.useState(new Array([]))
    const [vacationOwnerName, setVacationOwnerName] = React.useState("")
    const [blockRefuse, setBlockRefuse] = React.useState(false)
    const [requestUser, setRequestUser] = React.useState(null)
    const [delta, setDelta] = React.useState(0)
    const {currUser, roomUsers, setRoomUsers, setUnconfirmedEvents, unconfirmedEvents} = React.useContext(CalendarContext)

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
                setRequestUser(rUsers.find(val => {return val.uuid === vacation.uuid}))
            }
        })
        return { delta: counter};
    }

    React.useEffect(() => {
        setDelta(countDelta())
    }, [])

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                setVacationOwner(roomUsers.find(val => {return val.uuid === vacation.uuid}))
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
                        setRequestUser(rUsers.find(val => {return val.uuid === vacation.uuid}))
                    }
                })
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

    React.useEffect(() => {
        setDelta(countDelta())
    }, [vacations])

    const getFormatedDate = (date) => {
        return (new Date(date).getDate() < 10 ? "0" + new Date(date).getDate() : new Date(date).getDate()) + "-" + ((new Date(date).getMonth() + 1) < 10 ? "0" + (new Date(date).getMonth() + 1) : (new Date(date).getMonth() + 1)) + "-" + new Date(date).getFullYear()
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

                const a = new Array(unconfirmedEvents)
                let newUnconfirmedEvents = new Array()
                a.map(val => {
                    val.map(nVal => {
                        if(nVal.eventUID === vacation.eventUID) return
                        else {newUnconfirmedEvents = [...newUnconfirmedEvents, nVal]}
                    })
                })

                setUnconfirmedEvents(newUnconfirmedEvents)

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
                const delta = countDelta()

                update(ref(db, `rooms/${currUser.room}/members/${vacationOwner.uuid}`), {
                                                                                            vacationsNum:       vacation.type === VACATION_TYPE.VACATION ? vacationOwner.vacationsNum + delta.delta : vacationOwner.vacationsNum,
                                                                                            unpaidVacationDays: vacation.type === VACATION_TYPE.UNPAID ? vacationOwner.unpaidVacationDays - delta.delta : vacationOwner.unpaidVacationDays,
                                                                                            sickLeaves:         vacation.type === VACATION_TYPE.SICK_LEAVE ? vacationOwner.sickLeaves - delta.delta : vacationOwner.sickLeaves,
                                                                                            study:              vacation.type === VACATION_TYPE.STUDY ? vacationOwner.study - delta.delta : vacationOwner.study,
                                                                                        }) 
                .then(
                    update(ref(db, `users/${vacationOwner.uuid}/`), {
                                                                        vacationsNum:       vacation.type === VACATION_TYPE.VACATION ? vacationOwner.vacationsNum + delta.delta : vacationOwner.vacationsNum,
                                                                        unpaidVacationDays: vacation.type === VACATION_TYPE.UNPAID ? vacationOwner.unpaidVacationDays - delta.delta : vacationOwner.unpaidVacationDays,
                                                                        sickLeaves:         vacation.type === VACATION_TYPE.SICK_LEAVE ? vacationOwner.sickLeaves - delta.delta : vacationOwner.sickLeaves,
                                                                        study:              vacation.type === VACATION_TYPE.STUDY ? vacationOwner.study - delta.delta : vacationOwner.study,
                                                                    }) 
                    .then(
                        remove(ref(db, `rooms/${currUser.room}/events/pending/${vacation.eventUID}`))
                        .then(() => {
                            let arr = new Array()
                            vacations.map(val => {
                                if(val.eventUID !== vacation.eventUID) {arr = [...arr, val]}
                            })
                            setVacations(arr)
                            setUnconfirmedEvents(new Array());
                            let unconfirmed = new Array();
                            onValue(ref(db, `/rooms/${currUser.room}/events/pending/`), (snapshot) => {
                                const data = snapshot.val();
                                if (data !== null) {
                                Object.values(data).map((event) => {
                                    unconfirmed = [...unconfirmed, event]
                                });
                                setUnconfirmedEvents(unconfirmed);
                                }
                                return true
                            })
                        })
                        .then(() => {
                            
                            const time = setTimeout(setBlockRefuse(false), 1000);
                        })
                    )
                )
            }
        })
    }

    return (
        <div className='bg-white mb-1 rounded-md sm:w-120 w-80 screen-840:text-base text-xs'>
            <div className='sm:w-120 w-80 h-8 flex justify-between items-center mb-1'>
                <div className='flex justify-between w-full pr-1'>
                    <div className='font-bold'>{vacationOwnerName}</div>
                        {
                            <div className='font-bold flex justify-center items-center'>
                                <div>
                                    {vacation.type === VACATION_TYPE.VACATION ? "Vacation" 
                                    :
                                    vacation.type === VACATION_TYPE.UNPAID ? "Unpaid"
                                    : vacation.type === VACATION_TYPE.SICK_LEAVE ? "Sick"
                                    : ""}
                                </div>
                                <div className={
                                    vacation.type === VACATION_TYPE.VACATION ? "ml-1 mr-1 w-4 h-4 bg-green-500 rounded-full" 
                                    :
                                    vacation.type === VACATION_TYPE.UNPAID ? "ml-1 mr-1 w-4 h-4 bg-red-500 rounded-full"
                                    : vacation.type === VACATION_TYPE.SICK_LEAVE ? "ml-1 mr-1 w-4 h-4 bg-orange-500 rounded-full"
                                    : ""
                                }> 
                                </div>
                                <div>
                                    {delta.delta} {delta.delta % 10 === 1 && delta.delta !== 11 ? "day" : "days"} 
                                </div>
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
            <div>
                {
                    vacation.startDate === vacation.endDate ? <div className='semi-bold'>{`\t${getFormatedDate(vacation.startDate)}`}</div> : 
                    <div className='flex semi-bold'>
                        <div className=''>{`\t${getFormatedDate(vacation.startDate)}`}</div>
                        <div className='mr-2 ml-2'>to</div>
                        <div className=''>{`${getFormatedDate(vacation.endDate)}`}</div>
                    </div>
                }
                { vacation.description ? 
                    <div className=' italic text-sm'>P.S.: "{vacation.description}"</div>
                    :
                    ""
                }
            </div>
        </div>
    )
}
