import React from "react";
import dayjs from "dayjs";
import GlobalContext from "../../../context/GlobalContext";
import VacationWindow from "../VacationWindow";

export default function Day({day, rowIdx}) {
    const { monthIndex } = React.useContext(GlobalContext); // savedEvents
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);


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
        <div onClick={() => setShowVacationWindow(!ShowVacationWindow)} className="relative w-full h-full flex items-center justify-center border-grey-100 border-r-2 border-b-2 bg-main-gray border-grid-gray-180-17 cursor-default">
            { GetCurrentDay() }
        </div>
        <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={day}/>
    </div>
    )
}

