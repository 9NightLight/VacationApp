import React, { useState, useContext, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import DayNames from "./components/Content/CalendarParts/DayNames";
import GlobalContext from "./context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import UsersSettings from "./components/Navigations/UsersSettings";

export const CalendarContext = React.createContext();

export default function Home() {
    const { monthIndex, year } = useContext(GlobalContext)
    const [currentCalendar, setCurrentCalendar] = useState(getMonth(year, new Date().getMonth()))
    const [tab, setTab] = useState(0);
    const [users, setUsers] = React.useState(new Array());
    const [currUser, setCurrUser] = React.useState(new Array());

    useEffect(() => {
        setCurrentCalendar(getMonth(year, monthIndex));
    }, [monthIndex]);

    const navigate = useNavigate();
    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                navigate("/");
            }
            else if(!user){
                navigate("/auth");
            }
        })
    }, [])

    return (
        <React.Fragment>
            <CalendarContext.Provider value={{currentCalendar, setCurrentCalendar, tab, setTab, users, setUsers, currUser, setCurrUser}}>
                    <TopNavBar />
                    <div className="h-max--48 flex flex-1">
                        <GlobalSideBar />
                        { tab === 0 ?
                            <div className="flex flex-1 flex-col">
                            <CalendarHeader month={monthIndex}/>
                            <DayNames />
                            <Month month={currentCalendar} />
                            </div>
                        : tab === 1 ?
                            <UsersSettings />
                        : tab === 2 ?
                            <div>User Settings</div>
                        : tab === 3 ?
                            <div>Mail</div>
                        : tab === 4 ?
                            <div>Settings</div>
                        : <div></div>
                        }
                    </div>
            </CalendarContext.Provider>
        </React.Fragment>
    )
}
