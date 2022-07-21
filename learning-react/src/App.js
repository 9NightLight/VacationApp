import React, { useState, useContext, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import DayNames from "./components/Content/CalendarParts/DayNames";
import GlobalContext from "./context/GlobalContext";
import SignIn from "./components/SignIn";
// import { auth } from './firebase.js';
// import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';


//Clean console
  console.clear()
//
export const CalendarContext = React.createContext();

function App() {
  const { monthIndex, year } = useContext(GlobalContext)
  const [currentCalendar, setCurrentCalendar] = useState(getMonth(year, new Date().getMonth()))

  useEffect(() => {
    setCurrentCalendar(getMonth(year, monthIndex));
  }, [monthIndex]);

  return (
    <div>
      <SignIn />
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
    </div>
  );
}

export default App;