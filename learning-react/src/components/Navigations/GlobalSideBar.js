import React from "react";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalendarContext } from "../../Home";

export default function GlobalSideBar() {
    const { tab, setTab} = React.useContext(CalendarContext)

    return (
        <aside className="w-12 h-max--48 min-w-fit flex justify-between items-center flex-col border-r-2 text-gray-300">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon onClick={()=>setTab(0)} className={tab === 0 ? "w-8 h-12 mt-4 border-r-2 border-green-apple pr-2 pl-3 text-main-gray" : "w-8 h-12 mt-4 pr-2 pl-3"} icon={faCalendarDays} />
                <FontAwesomeIcon onClick={()=>setTab(1)} className={tab === 1 ? "w-10 h-12 pr-1 pl-2 border-r-2 border-orange-apple text-main-gray" : "w-10 h-12 pr-1 pl-2"} icon={faUserGear} />
                <FontAwesomeIcon onClick={()=>setTab(2)} className={tab === 2 ? "w-8 h-12 pr-2 pl-3 border-r-2 border-blue-apple text-main-gray" :"w-8 h-12 pr-2 pl-3"} icon={faUser} />
                <FontAwesomeIcon onClick={()=>setTab(3)} className={tab === 3 ? "w-8 h-12 pr-2 pl-3 border-r-2 border-indigo-apple text-main-gray" : "w-8 h-12 pr-2 pl-3"} icon={faEnvelope} />
            </div>
            <div className="mb-3 flex flex-col items-center justify-center">
                <FontAwesomeIcon onClick={()=>setTab(4)} className={tab === 4 ? "w-8 h-12 pr-2 pl-3 border-r-2 border-red-apple text-main-gray" : "w-8 h-12 pr-2 pl-3"} icon={faGear} />
            </div>
        </aside>

    )
}