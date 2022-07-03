import React, { useState, useContext, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import DayNames from "./components/Content/CalendarParts/DayNames";
import GlobalContext from "./context/GlobalContext";
import EventBox from "./EventBox"

//Clean console
  console.clear()
//

function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth())
  const { monthIndex, year, savedEvents } = useContext(GlobalContext)

  useEffect(() => {
    setCurrentMonth(getMonth(year, monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      <TopNavBar />
      <div className="h-max--48 flex flex-1">
        <GlobalSideBar />
        <div className="flex flex-1 flex-col">
          <CalendarHeader month={monthIndex}/>
          <DayNames />
          <Month month={currentMonth} />
          <div className='ml-2 w-192 h-full bg-red-500'>
            {
              savedEvents.map(event => {
                return <EventBox key={event.id} event={event} />
              })
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;