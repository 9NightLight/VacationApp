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

export default function VacationWindow({show, date, setShow}) {
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(show)
    
    function onSubmit() {
        auth.onAuthStateChanged(user => {
            const uuid = user.uid;
            const uidd = uid();
            set(ref(db, `/events/${uidd}`), {
                type: Type,
                description: Description,
                startDate: Dates[0].toString(),
                endDate: Dates[1].toString(),
                id: new Date(),
                uuid: uuid,
            })
        })
        setShowVacationWindow(false)
    }
    
    const [Type, SetType] = React.useState("Unpayed")
    const [Description, SetDescription] = React.useState("")
    const [Dates, SetDates] = React.useState(new Array(new Date(), new Date()))

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
                            <Header />
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
                            <Submit />
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