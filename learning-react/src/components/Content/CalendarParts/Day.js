import React from "react";
import dayjs from "dayjs";
import GlobalContext from "../../../context/GlobalContext";
import VacationWindow from "../VacationWindow";
import { CalendarContext } from "../../../App";


export default function Day({day, rowIdx}) {
    const { monthIndex, savedEvents } = React.useContext(GlobalContext);
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);
    const {currentCalendar} = React.useContext(CalendarContext);

    function initFunc() {
        let counter = 0
        savedEvents.map(e => {
            return new Date(e.startDate).getTime() <= new Date(day).getTime() && new Date(e.endDate).getTime() >= new Date(day).getTime() ? counter++ : counter        
        })
        return counter
    }
    
    const [TodayEvents, setTodayEvents] = React.useState(initFunc())

    React.useEffect(() => {
        setTodayEvents(initFunc());
    }, [currentCalendar])

    function GetLessDays() {
        return (day.month() !== monthIndex
        ? <div className="relative w-8 h-8 justify-center items-center flex box-content text-gray-500">{ day.format("D") }</div>
        : <div className="relative w-8 h-8 justify-center items-center flex box-content text-white">{ day.format("D") }</div>
        )
    }

    function GetCurrentDay() { 
        return(
        day.format("DD-MM-YYYY") !== dayjs().format("DD-MM-YYYY")
        ? GetLessDays()
        : <div className="relative w-8 h-8 justify-center items-center flex box-content rounded-full bg-green-apple text-black">{ day.format("D") }</div>
        ) 
    }

    return (
    <div>
        <div onClick={() => setShowVacationWindow(!ShowVacationWindow)} className="relative w-full h-full flex items-center justify-center border-grey-100 border-r-2 border-b-2 bg-main-gray border-grid-gray-180-17 cursor-default">
            { GetCurrentDay() }
            <div className="absolute flex flex-row justify-start left-0 top-0 w-full h-full p-1">
                {TodayEvents >= 1 ? 
                    <div className="ml-2 w-3 h-3 left-0 top-0 rounded-full bg-white">
                        
                    </div>
                    : <></>
                }      
                {TodayEvents >=2 ?
                    <div className="ml-2 w-3 h-3 left-0 top-0 rounded-full bg-yellow-400">
                        
                    </div>
                    : <></>
                }
                {TodayEvents >= 3 ?
                    <div className="ml-2 w-3 h-3 left-0 top-0 rounded-full bg-blue-400">
                        
                    </div>
                    : <></>
                }
                {TodayEvents >= 4 ?
                    <div className="ml-2 w-3 h-3 left-0 top-0 rounded-full bg-orange-400">
                        
                    </div>
                    : <></>
                }
            </div>
        </div>
        <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={day}/>
    </div>
    )
}

