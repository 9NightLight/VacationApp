import React, { useState, useContext, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import DayNames from "./components/Content/CalendarParts/DayNames";
import GlobalContext from "./context/GlobalContext";

export const CalendarContext = React.createContext();

export default function Home() {
    const { monthIndex, year } = useContext(GlobalContext)
    const [currentCalendar, setCurrentCalendar] = useState(getMonth(year, new Date().getMonth()))

    useEffect(() => {
        setCurrentCalendar(getMonth(year, monthIndex));
    }, [monthIndex]);

    return (
        <React.Fragment>
            <TopNavBar />
            <div className="h-max--48 flex flex-1">
                <GlobalSideBar />
                <div className="flex flex-1 flex-col">
                <CalendarHeader month={monthIndex}/>
                <DayNames />
                <CalendarContext.Provider value={{currentCalendar, setCurrentCalendar}}>
                    <Month month={currentCalendar} />
                </CalendarContext.Provider>
                </div>
            </div>
        </React.Fragment>
    )
}
