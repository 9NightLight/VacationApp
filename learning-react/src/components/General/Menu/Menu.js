import React from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalendarContext, TABS } from "../../../Home";
import Mail from "../../../images/Icons/Mail";

export default function Menu() {
    const { tab, setTab, notificationNumber, isRoomActive} = React.useContext(CalendarContext)



    return (
        <div className="z-20 fixed w-full h-12 bottom-0 flex items-center bg-white shadow shadow-black/20 text-staticIcon">
            {/* {isRoomActive ? */}
                <div className="w-full h-8 flex justify-around items-end">
                    <div className="h-8 flex flex-col justify-end items-center">
                        <FontAwesomeIcon 
                            onClick={()=>setTab(TABS.CALENDAR)} 
                            className={tab === TABS.CALENDAR ? "w-5 h-5 text-blue-600" : "w-5 h-5 text-staticIcon"} 
                            icon={faCalendarDays} 
                        />
                        <div className={tab === TABS.CALENDAR ? "text-xs text-blue-600" : "text-xs text-staticIcon"}>Calendar</div>
                    </div>
                    <div className="relative h-8 flex flex-col items-center justify-end">
                        <Mail 
                            _width={20}
                            _height={15}
                            _staticColor={"#515151"}
                            _activeColor={"#C56621"}
                            _isActive={tab === TABS.POST}
                            _onClick={() => setTab(TABS.POST)}
                        />
                        {
                            notificationNumber !== 0 && tab !== TABS.POST ?
                                <div className="absolute w-7 h-9" onClick={() => setTab(TABS.POST)}>
                                    <div className="absolute w-2 h-2 top-0 right-0 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">
                                        {/* {notificationNumber < 9 ? notificationNumber : notificationNumber > 9 ? "9+" : ""} */}
                                    </div>
                                </div>
                            : ""
                        }
                        <div className={tab === TABS.POST ? "text-xs text-activeMail" : "text-xs text-staticIcon"}>Post</div>
                    </div>
                    <div className="h-8 flex flex-col items-center justify-end">
                        <FontAwesomeIcon 
                            onClick={()=>setTab(TABS.MEMBERS)} 
                            className={tab === TABS.MEMBERS ? "w-5 h-5 text-green-600" : "w-5 h-4 text-staticIcon"} 
                            icon={faUsers} 
                        />
                        <div className={tab === TABS.MEMBERS ? "text-xs text-green-600" : "text-xs text-staticIcon"}>Members</div>
                    </div>
                    <div className="h-8 flex flex-col items-center justify-end">
                        <FontAwesomeIcon 
                            onClick={()=>setTab(TABS.SETTINGS)} 
                            className={tab === TABS.SETTINGS ? "w-5 h-5 text-rose-600" : "w-4 h-4 text-staticIcon"} 
                            icon={faGear} 
                        />
                        <div className={tab === TABS.SETTINGS ? "text-xs text-rose-600" : "text-xs text-staticIcon"}>Settings</div>
                    </div>
                    {/* <FontAwesomeIcon onClick={()=>setTab(TABS.SETTINGS)} className={tab === TABS.SETTINGS ? "w-8 h-12 text-rose-600" : "w-8 h-12 text-staticIcon"} icon={faGear} /> */}
                    {/* <FontAwesomeIcon onClick={()=>setTab(TABS.PROFILE)} className={tab === TABS.PROFILE ? "w-8 h-12 text-green-600" :"w-8 h-12 text-staticIcon"} icon={faUser} /> */}
                </div>
            {/* // : ""
            // } */}
            {/* <div className="w-1/2 flex justify-around">
                <Mail 
                    _width={32}
                    _staticColor={"#515151"}
                    _activeColor={"#C56621"}
                    _isActive={tab === TABS.POST}
                    _onClick={() => setTab(TABS.POST)}
                />
                {
                    notificationNumber !== 0 ?
                        <div className="absolute top-56 left-8 w-4 h-4 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">{notificationNumber < 9 ? notificationNumber : notificationNumber > 9 ? "9+" : ""}</div>
                    : ""
                }
                {isRoomActive ?
                    <FontAwesomeIcon onClick={()=>setTab(TABS.SETTINGS)} className={tab === TABS.SETTINGS ? "w-8 h-12 text-rose-600" : "w-8 h-12 text-staticIcon"} icon={faGear} />
                    : ""
                }
            </div> */}
        </div>
    )
}