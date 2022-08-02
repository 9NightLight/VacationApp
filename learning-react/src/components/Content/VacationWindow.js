import React from "react";
import Header from "../VacationWindowComponents/Header";
import Submit from "../VacationWindowComponents/Submit";
import TypeVacation from "../VacationWindowComponents/TypeVacation";
import VacationDescription from "../VacationWindowComponents/VacationDescription";
import CalendarMini from "../VacationWindowComponents/CalendarMini";
import TransitionComponent from "../TransitionComponent";
import { ref, set } from 'firebase/database';
import { auth, db } from '../../firebase.js';
import { uid } from 'uid';
import { CalendarContext } from "../../Home";

export default function VacationWindow({show, date, setShow}) {
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(show);
    const {currUser} = React.useContext(CalendarContext)
    
    function onSubmit(e) {
        e.preventDefault()
        auth.onAuthStateChanged(user => {
            if(user)
            {
                const _uid = uid();
                const sD = new Date(Dates[0].toString());
                sD.setHours(0, 0, 0, 0);
                const eD = new Date(Dates[1].toString());
                eD.setHours(0, 0, 0, 0);
                set(ref(db, `/rooms/${currUser.room}/events/pending/${_uid}`), {
                    type: Type,
                    description: Description,
                    startDate: sD.toString(),
                    endDate: eD.toString(),
                    uuid: currUser.uuid,
                })
            }
        })
        setShowVacationWindow(false)
    }
    
    const [Type, SetType] = React.useState("Unpayed")
    const [Description, SetDescription] = React.useState("")
    const [Dates, SetDates] = React.useState(new Array(new Date(), new Date()))
    const [deltaDates, setDeltaDates] = React.useState(1)

    React.useEffect(()=> {
        const sD = new Date(Dates[0].toString());
        sD.setHours(0, 0, 0, 0);
        const eD = new Date(Dates[1].toString());
        eD.setHours(0, 0, 0, 0);

        setDeltaDates(Math.ceil((sD  - eD) / (1000 * 3600 * 24)) - 1)
    }, [Dates])

    React.useEffect(() => {
        setShowVacationWindow(show)
        if(show == false) {
        SetType("Unpayed")
        SetDescription("")
        SetDates(new Array(new Date(), new Date()))
        }
    }, [show])

    return (
        <React.Fragment>
            <TransitionComponent content={<div className="z-10 absolute left-0 top-0 w-full h-full flex justify-center items-center">
                <div className="z-20 w-96 h-120 bg-white flex flex-col justify-around rounded-xl shadow-xl">
                    <form onSubmit={onSubmit}>
                        <div className="w-full h-20 flex justify-center items-center">
                            <Header delta={deltaDates}/>
                        </div>
                        <div className="w-full h-32 flex justify-center items-center">
                            <TypeVacation setType={SetType}/>
                        </div>
                        <div className="w-full h-20 flex justify-center items-center">
                            <VacationDescription setDescription={SetDescription}/>
                        </div>
                        <div className="static w-full h-20 p-4 flex justify-center items-center">
                            <CalendarMini clickedDate={date} setDates={SetDates}/>
                        </div>
                        <div className="w-full h-20 flex justify-center items-center"
                             >
                            <Submit delta={deltaDates}/>
                        </div>
                    </form>
                    </div>
                    <TransitionComponent
                        content = {
                            <div onClick={() => setShow(false)} className="z-10 absolute w-full h-full left-0 top-0"></div>
                        }
                    show={ShowVacationWindow}/>
                </div>
            } show={ShowVacationWindow} />

            
        </React.Fragment>
    )
}