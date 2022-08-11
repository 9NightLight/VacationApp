import React, { useState, useContext, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import DayNames from "./components/Content/CalendarParts/DayNames";
import GlobalContext from "./context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import UsersSettings from "./components/Navigations/UsersSettings";
import Notifications from "./components/Navigations/Notifications";
import UserSettings from "./components/Navigations/UserSettings";
import SettingsTab from "./components/Navigations/SettingsTab";
///
import {
ref,
getDownloadURL,
} from "firebase/storage";
import { storage } from "./firebase";
import { onValue } from "firebase/database";

export const CalendarContext = React.createContext();

export default function Home() {
    const { monthIndex, year } = useContext(GlobalContext)
    const [currentCalendar, setCurrentCalendar] = useState(getMonth(year, new Date().getMonth()))
    const [tab, setTab] = useState(0);
    const [users, setUsers] = React.useState(new Array());
    const [currUser, setCurrUser] = React.useState(new Array());
    const [currUserPhoto, setCurrUserPhoto] = React.useState(null);
    const [roomUsers, setRoomUsers] = React.useState(new Array());
    const [darkTheme, setDarkTheme] = React.useState(false)
    const [defaultNumVacations, setDefaultNumVacations] = React.useState(0)
    

    useEffect(() => {
        setCurrentCalendar(getMonth(year, monthIndex));
    }, [monthIndex]);

    const navigate = useNavigate();
    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                navigate("/");
                onValue(ref(db, `rooms/${currUser.room}/settings/`), (snapshot) => {
                    const data = snapshot.val()
                    if(data !== null)
                    {
                        setDefaultNumVacations(data.defaultNumVacations)
                    }
                })
            }
            else if(!user){
                navigate("/auth");
            }
        })
    }, [])

    useEffect(() => {
        if(currUser.uuid !== undefined) 
        {
            getDownloadURL(ref(storage, `${currUser.uuid}`))
            .then((url) => { 
                setCurrUserPhoto(url)
            })
        }
    }, [currUser]);

    return (
        <React.Fragment>
            <CalendarContext.Provider value={{  
                                                currentCalendar, setCurrentCalendar, 
                                                tab, setTab, 
                                                users, setUsers, 
                                                currUser, setCurrUser, 
                                                roomUsers, setRoomUsers,
                                                darkTheme, setDarkTheme,
                                                currUserPhoto, setCurrUserPhoto,
                                                defaultNumVacations, setDefaultNumVacations,
                                                }}>
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
                            <UserSettings />
                        : tab === 3 ?
                            <Notifications tab={tab}/>
                        : tab === 4 ?
                            <SettingsTab />
                        : <div></div>
                        }
                    </div>
            </CalendarContext.Provider>
        </React.Fragment>
    )
}
