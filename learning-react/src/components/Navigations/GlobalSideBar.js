import React from "react";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalendarContext } from "../../Home";

export default function GlobalSideBar() {
    const { tab, setTab, notificationNumber} = React.useContext(CalendarContext)

    return (
        <div className="h-max--48 w-12 flex">
            <aside className="flex-col border-r-2 text-gray-300">
                <FontAwesomeIcon onClick={()=>setTab(0)} className={tab === 0 ? "w-8 h-12 mt-4 border-r-2 border-green-apple pr-2 pl-3 text-main-gray" : "w-8 h-12 mt-4 pr-2 pl-3 hover:text-main-gray"} icon={faCalendarDays} />
                <FontAwesomeIcon onClick={()=>setTab(1)} className={tab === 1 ? "w-10 h-12 pr-1 pl-2 border-r-2 border-orange-apple text-main-gray" : "w-10 h-12 pr-1 pl-2 hover:text-main-gray"} icon={faUserGear} />
                <FontAwesomeIcon onClick={()=>setTab(2)} className={tab === 2 ? "w-8 h-12 pr-2 pl-3 border-r-2 border-blue-apple text-main-gray" :"w-8 h-12 pr-2 pl-3 hover:text-main-gray"} icon={faUser} />
                <FontAwesomeIcon onClick={()=>setTab(3)} className={tab === 3 ? "w-8 h-12 pr-2 pl-3 border-r-2 border-indigo-apple text-main-gray" : "w-8 h-12 pr-2 pl-3 hover:text-main-gray"} icon={faEnvelope} />
                {
                    notificationNumber !== 0 ?
                        <div className="absolute top-56 left-8 w-4 h-4 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">{notificationNumber < 9 ? notificationNumber : notificationNumber > 9 ? "9+" : ""}</div>
                    : ""
                }
                <FontAwesomeIcon onClick={()=>setTab(4)} className={tab === 4 ? "w-8 h-12 pr-2 pl-3 border-r-2 border-red-apple text-main-gray" : "w-8 h-12 pr-2 pl-3 hover:text-main-gray"} icon={faGear} />
            </aside>
        </div>
    )
}