import React from "react";
import dayjs from "dayjs";
import { faChevronLeft, faChevronRight, faPlus} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VacationWindow from "../Features/BookVacationWindow";
import { CalendarContext } from "../../../../Home";

export default function CalendarHeader({month}) {
  const { year, setYear, monthIndex, setMonthIndex } = React.useContext(CalendarContext);
  const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);

  function handlePrevMonth() {
    if(monthIndex === 0)
    { 
      setMonthIndex(11);
      setYear(year => year - 1);
    } 
    else
    {
      setMonthIndex(e => e - 1)
    }
  }

  function handleNextMonth() {
    if(monthIndex == 11)
    { 
      setMonthIndex(0);
      setYear(year => year + 1);
    } 
    else
    {
      setMonthIndex(m => m + 1);    
    };
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex
        : dayjs().month()
    );
    setYear(dayjs().year());
  }

  const Monthes = new Array(
    "January","February","March", "April", "May", "June", "July",
    "August","September","October","November","December"
  )

  return (
    <div style={{backgroundImage: "linear-gradient(45deg, #00268E, #439AFF)", height: "144px"}}>
      <div className="relative w-full h-full flex flex-col justify-between items-center pt-4 pb-12 text-white">
        <div className="w-full flex justify-center">
          <div className="font-bold text-2xl">Calendar</div>
          <FontAwesomeIcon 
            className="absolute right-4 font-bold text-2xl"
            onClick={()=>setShowVacationWindow(true)}
            icon={faPlus}
          />
        </div>
        <div className="w-3/5 max-w-xs flex font-semibold justify-around items-center">
          <FontAwesomeIcon onClick={handlePrevMonth} className="w-3 cursor-pointer" icon={faChevronLeft}/>
          <div 
            onClick={handleReset} 
            className="text-xl font-medium">{Monthes[month]} {year}
          </div>
          <FontAwesomeIcon onClick={handleNextMonth} className="w-3 cursor-pointer" icon={faChevronRight}/>
        </div>
      </div>
      <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={dayjs()}/>
    </div>
  )
}