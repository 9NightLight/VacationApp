import React from "react";
import dayjs from "dayjs";
import VacationWindow from "../Features/BookVacationWindow";
import { CalendarContext } from "../../../../Home";

export default function Day({day}) {
    const { monthIndex } = React.useContext(CalendarContext);
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);
    const NameDay = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

    function GetLessDays() {
        return (day.month() !== monthIndex
        ? <div className="relative w-8 h-8 justify-center items-center flex box-content text-gray-500 text-sm">{ day.format("D") }</div>
        : <div className="relative w-8 h-8 justify-center items-center flex box-content text-white text-sm">{ day.format("D") }</div>
        )
    }

    function GetCurrentDay() { 
        return(
        day.format("DD-MM-YYYY") !== dayjs().format("DD-MM-YYYY")
        ? GetLessDays()
        : <div className="relative w-8 h-8 justify-center items-center flex box-content text-black text-sm">
            <div className="w-6 h-6 bg-green-apple flex justify-center items-center rounded-full">
                { day.format("D") }
            </div>
          </div>
        ) 
    }

    return (
    <div>
        <div className="flex justify-center w-34px text-xs">{NameDay[new Date(day).getDay()]}</div>
        <div onClick={() => setShowVacationWindow(!ShowVacationWindow)} className="relative w-34 h-34 flex items-center justify-center border-grey-100 border-r-2 border-b-2 bg-main-gray border-grid-gray-180-17 cursor-default">
            { GetCurrentDay() }
        </div>
        <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={day}/>
    </div>
    )
}

