import React from "react";
import Header from "./VacationWindowComponents/Header";
import Submit from "./VacationWindowComponents/Submit";
import TypeVacation from "./VacationWindowComponents/TypeVacation";
import VacationDescription from "./VacationWindowComponents/VacationDescription";
import CalendarMini from "./VacationWindowComponents/CalendarMini";
import TransitionComponent from "../TransitionComponent";
import { onValue, ref, set, update } from 'firebase/database';
import { auth, db, functions } from '../../firebase.js';
import { uid } from 'uid';
import { CalendarContext } from "../../Home";
import { ROLES } from "../SignIn";
import { httpsCallable } from "firebase/functions";

export const VACATION_TYPE = {
    UNPAID: "Unpayed",
    VACATION: "Vacation",
    SICK_LEAVE: "Sick leave",
    HOLIDAY: "Holiday"
}

export default function VacationWindow({show, date, setShow}) {
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(show);
    const {currUser, roomUsers, unconfirmedEvents, savedEvents} = React.useContext(CalendarContext)
    const [type, SetType] = React.useState(VACATION_TYPE.UNPAID)
    const [Description, SetDescription] = React.useState("")
    const [Dates, SetDates] = React.useState(new Array(new Date(), new Date()))
    const [deltaDates, setDeltaDates] = React.useState(1)
    const _uid = uid(); // if on, occurs some problems with confirmed

    const countDelta = async () => {
        const sD = new Date(Dates[0].toString());
        sD.setHours(0, 0, 0, 0);
        const eD = new Date(Dates[1].toString());
        eD.setHours(0, 0, 0, 0);


        if(
            savedEvents.find(e => {
                if( sD >= new Date(e.startDate) && sD <= new Date(e.endDate) 
                    || eD >= new Date(e.startDate) && eD <= new Date(e.endDate) 
                    || sD <= new Date(e.startDate) && eD >= new Date(e.endDate)  ) return true
            })
            || 
            unconfirmedEvents.find(e => {
                if( sD >= new Date(e.startDate) && sD <= new Date(e.endDate) 
                    || eD >= new Date(e.startDate) && eD <= new Date(e.endDate) 
                    || sD <= new Date(e.startDate) && eD >= new Date(e.endDate)  ) return true
            })
        ) {
            setDeltaDates(-1)
            return -1
        }
        else
        {
            let a = 0;
            let dd = sD
            let counter = 0;
            do {
                dd = new Date(dd.setDate((dd.getDate() + a)))
                if(dd.getDay() !== 6 && dd.getDay() !== 0) counter++
                a = 1
            } while(dd.getTime() !== eD.getTime())
            setDeltaDates(counter)
            return counter
        }
    }
    
    const onSubmit = (e) => {
        e.preventDefault()
        auth.onAuthStateChanged(user => {
            if(user && ShowVacationWindow === true)
            {
                let delta = countDelta()
                delta.then(result => {
                let d = result
                
                if(d !== 0)
                {
                    const sD = new Date(Dates[0].toString());
                    sD.setHours(0, 0, 0, 0);
                    const eD = new Date(Dates[1].toString());
                    eD.setHours(0, 0, 0, 0);
                    
                    set(ref(db, `/rooms/${currUser.room}/events/pending/${_uid}`), {
                        type: type,
                        description: Description,
                        startDate: sD.toString(),
                        endDate: eD.toString(),
                        uuid: currUser.uuid,
                        eventUID: _uid,
                    })
                    update(ref(db, `rooms/${currUser.room}/members/${currUser.uuid}/`), {   vacationsNum: type === VACATION_TYPE.VACATION ? Number(currUser.vacationsNum) - d : currUser.vacationsNum,
                                                                                            unpaidVacationDays: type === VACATION_TYPE.UNPAID ? Number(currUser.unpaidVacationDays) + d : currUser.unpaidVacationDays,
                                                                                            sickLeaves: type === VACATION_TYPE.SICK_LEAVE ? Number(currUser.sickLeaves) + d : currUser.sickLeaves,
                                                                                        }) 
                    .then(
                        update(ref(db, `users/${currUser.uuid}/`), {    vacationsNum: type === VACATION_TYPE.VACATION ? Number(currUser.vacationsNum) - d : currUser.vacationsNum,
                                                                        unpaidVacationDays: type === VACATION_TYPE.UNPAID ? Number(currUser.unpaidVacationDays) + d : currUser.unpaidVacationDays,
                                                                        sickLeaves: type === VACATION_TYPE.SICK_LEAVE ? Number(currUser.sickLeaves) + d : currUser.sickLeaves,
                                                                    }) 
                        .then(
                            roomUsers.map(u => {
                                if(u.role === ROLES.HRMANAGER || u.role === ROLES.ADMIN)
                                {
                                    const addMessage = httpsCallable(functions, 'vacationRequest');
                                    addMessage({name: u.firstName, to_email: u.email, from_firstName: currUser.firstName, from_lastName: currUser.lastName})
                                    .then((result) => {
                                        console.log(result.data);
                                    }).catch((error) => {
                                        console.log(`error: ${JSON.stringify(error)}`);
                                    });
                                }
                            })
                        )
                    )
                }})
            }
        })
        setShowVacationWindow(false)
    }
    
    React.useEffect(()=> {
        countDelta()
    }, [Dates])

    React.useEffect(() => {
        setShowVacationWindow(show)
        if(show == false) {
        SetType(VACATION_TYPE.UNPAID)
        SetDescription("")
        SetDates(new Array(new Date(), new Date()))
        }
    }, [show])

    return (
        <React.Fragment>
            <TransitionComponent content={<div className="z-10 absolute left-0 top-0 w-full h-full flex justify-center items-center">
                <div className="z-20 w-96 h-96 bg-white flex flex-col justify-start rounded-xl shadow-xl">
                    <form onSubmit={onSubmit}>
                        <div className="w-full h-20 flex justify-center items-start">
                            <Header delta={deltaDates} type={type}/>
                        </div>
                        <div className="w-full h-32 flex justify-center items-center">
                            <TypeVacation setType={SetType}/>
                        </div>
                        {/* <div className="w-full h-20 flex justify-center items-center">
                            <VacationDescription setDescription={SetDescription}/>
                        </div> */}
                        <div className="static w-full h-20 p-4 flex flex-col justify-center items-center">
                            <div className="w-full h-10"><CalendarMini clickedDate={date} setDates={SetDates}/></div>
                            <div className="font-bold">
                                <div className="text-green-700">{ deltaDates === -1 ? "" : deltaDates !== 0 ? deltaDates === 1 ? `${deltaDates} work day` : deltaDates !== 1 ? `${deltaDates} work days` : deltaDates === 0 ? deltaDates : "" : ""}</div>
                                <div className="text-xs text-red-500">{type === VACATION_TYPE.VACATION ? deltaDates > currUser.vacationsNum ? "You don't have enough vacations!" : "" : ""}</div>
                                <div className="text-xs text-red-500">{deltaDates === -1 ? "You have vacation on this dates" : deltaDates === 0 ? "Weekends to enjoy!" : ""}</div>
                            </div>
                        </div>
                        <div className="w-full h-20 flex justify-center items-end"
                             >
                            <Submit delta={deltaDates} type={type}/>
                        </div>
                    </form>
                    </div>
                    <TransitionComponent
                        content = {
                            <div onClick={() => setShow(false)} className="z-10 bg-gray-700/50 absolute w-full h-full left-0 top-0"></div>
                        }
                    show={ShowVacationWindow}/>
                </div>
            } show={ShowVacationWindow} />

            
        </React.Fragment>
    )
}