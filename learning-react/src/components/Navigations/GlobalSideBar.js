import React from "react";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalendarContext } from "../../Home";

export default function GlobalSideBar() {
    const { setTab} = React.useContext(CalendarContext)


    return (
        <aside className="w-12 h-max--48 min-w-fit flex justify-between items-center flex-col text-main-gray border-r-2">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon onClick={()=>setTab(0)} className="w-8 h-8 mb-4 mt-4" icon={faCalendarDays} />
                <FontAwesomeIcon onClick={()=>setTab(1)} className="w-8 h-8 mb-4 pl-1" icon={faUserGear} />
                <FontAwesomeIcon onClick={()=>setTab(2)} className="w-8 h-8 mb-4" icon={faUser} />
                <FontAwesomeIcon onClick={()=>setTab(3)} className="w-8 h-8 mb-4" icon={faEnvelope} />
            </div>
            <div className="mb-3 flex flex-col items-center justify-center">
                <FontAwesomeIcon onClick={()=>setTab(4)} className="w-8 h-8" icon={faGear} />
            </div>
        </aside>

    )
}