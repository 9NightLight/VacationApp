import React, { useState, useContext, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import UsersSettings from "./components/Navigations/UsersSettings";
import Notifications from "./components/Navigations/Notifications";
import UserSettings from "./components/Navigations/UserSettings";
import SettingsTab from "./components/Navigations/SettingsTab";
import dayjs from "dayjs";
import LoadingScreen from "./components/AwaitComponents/LoadingScreen";


///

export const CalendarContext = React.createContext();

export default function Home() {
    const [year, setYear] = useState(dayjs().year());
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [currentCalendar, setCurrentCalendar] = useState(getMonth(year, new Date().getMonth()))
    const [tab, setTab] = useState(0);
    const [users, setUsers] = React.useState(new Array());
    const [currUser, setCurrUser] = React.useState(new Array());
    const [currUserPhoto, setCurrUserPhoto] = React.useState(null);
    const [roomUsers, setRoomUsers] = React.useState(new Array());
    const [darkTheme, setDarkTheme] = React.useState(false)
    const [defaultNumVacations, setDefaultNumVacations] = React.useState(0)
    const [countryAttribute, setCountryAttribute] = React.useState(null)
    const [showLoadingScreen, setShowLoadingScreen] = React.useState(true)

    useEffect(() => {
        setCurrentCalendar(getMonth(year, monthIndex));
    }, [monthIndex]);

    const navigate = useNavigate();
    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                navigate("/")
            }
            else if(!user){
                navigate("/auth");
            }
        })
    }, [])

    React.useEffect(() => {
        countryAttribute && roomUsers ? 
        setTimeout(() => {
            setShowLoadingScreen(false)
        }, 1000)
        : setShowLoadingScreen(true)
    }, [countryAttribute])

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
                                                countryAttribute, setCountryAttribute,
                                                showLoadingScreen, setShowLoadingScreen,
                                                defaultNumVacations, setDefaultNumVacations,
                                                year, setYear,
                                                monthIndex, setMonthIndex,
                                                }}>
                    <TopNavBar />
                    <div className="h-max--48 flex flex-1">
                        <GlobalSideBar />
                        { tab === 0 ?
                            <div className="flex flex-1 flex-col">
                                <CalendarHeader month={monthIndex}/>
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
                    <LoadingScreen show={showLoadingScreen}/>
            </CalendarContext.Provider>
        </React.Fragment>
    )
}