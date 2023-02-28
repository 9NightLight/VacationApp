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
        ? 
            <div className="text-gray-400">
                <div 
                    className="relative justify-center items-center flex box-content text-xs font-medium">{ day.format("D") }
                </div>
                <div 
                    style={{fontSize: "9px"}}>{NameDay[new Date(day).getDay()]}
                </div>
            </div>
        : 
            <div className="text-white text-xs font-medium">
                <div 
                    className="relative justify-center items-center flex box-content">{ day.format("D") }
                </div>
                <div 
                    style={{fontSize: "9px"}}>{NameDay[new Date(day).getDay()]}
                </div>
            </div>
        )
    }

    function GetCurrentDay() { 
        return GetLessDays()
        // return(
        // day.format("DD-MM-YYYY") !== dayjs().format("DD-MM-YYYY")
        // ? GetLessDays()
        // : <div className="relative justify-center items-center flex box-content text-sm text-white">
        //         { day.format("D") }
        //   </div>
        // ) 
    }

    return (
    <div className="text-white text-xs">
        {/* <div className=" flex justify-center w-34px text-xs">{NameDay[new Date(day).getDay()]}</div> */}
        <div 
            onClick={() => setShowVacationWindow(!ShowVacationWindow)}
            className="w-34px h-34px flex flex-col items-center justify-center border-grey-100 border border-gray-100 cursor-default"
            style={{backgroundImage: "linear-gradient(45deg, #39547C, #0066FF)", width: "30px", height: "30px"}}>
            { GetLessDays() }
        </div>
        <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={day}/>
    </div>
    )
}

