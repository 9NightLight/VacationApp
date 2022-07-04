import React from "react";
import dayjs from "dayjs";
import GlobalContext from "../../../context/GlobalContext";
import VacationWindow from "../VacationWindow";
import TransitionComponent from "../../TransitionComponent";
import { render } from "@testing-library/react";


export default function Day({day, rowIdx}) {
    const { monthIndex, savedEvents } = React.useContext(GlobalContext);
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);

    function getEventColor() {
        savedEvents.map(e => {
            return e.startDate.slice(4, 15) <= new Date(day).toString().slice(4, 15) && e.endDate.slice(4, 15) >= new Date(day).toString().slice(4, 15) ? e.color.to : ""
        })
    }

    function initFunc() {
        let counter = 0
        savedEvents.map(e => {
            return e.startDate.slice(4, 15) <= new Date(day).toString().slice(4, 15) && e.endDate.slice(4, 15) >= new Date(day).toString().slice(4, 15) ? counter++ : counter
        })
        return counter
    }
    
    function dispatch(state, action) {}

    const [TodayEvents, setTodayEvents] = React.useReducer(dispatch, 0, initFunc)



    function GetLessDays() {
        return (day.month() != monthIndex
        ? <div className="relative w-8 h-8 justify-center items-center flex box-content text-gray-500">{ day.format("D") }</div>
        : <div className="relative w-8 h-8 justify-center items-center flex box-content text-white">{ day.format("D") }</div>
        )
    }

    function GetCurrentDay() { 
        return(
        day.format("DD-MM-YYYY") != dayjs().format("DD-MM-YYYY")
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

