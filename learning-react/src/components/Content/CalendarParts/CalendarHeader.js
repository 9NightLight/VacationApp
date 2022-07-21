import React from "react";
import dayjs from "dayjs";
import GlobalContext from "../../../context/GlobalContext";
import { faCircleChevronLeft, faCircleChevronRight, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CalendarHeader({month}) {
  const { monthIndex, setMonthIndex } = React.useContext(GlobalContext);
  const { year, setYear } = React.useContext(GlobalContext)

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
    "January","February","March","April","May","June","July",
    "August","September","October","November","December"
  )

  return (
      <div className="flex items-center pt-2 pb-2">
        <div className="text-xl font-bold ml-2 w-48 flex justify-between">
          <div>{Monthes[month]}</div>
          <div>{year}</div>
        </div>
        <div className="ml-4 w-32 flex justify-between">
          <FontAwesomeIcon onClick={handlePrevMonth} className="w-8 h-8 text-orange-apple cursor-pointer" icon={faCircleChevronLeft}/>
          <FontAwesomeIcon onClick={handleNextMonth} className="w-8 h-8 text-orange-apple cursor-pointer" icon={faCircleChevronRight}/>
          <div onClick={handleReset} className="w-8 h-8 relative bg-green-apple text-black box-content rounded-full flex items-center justify-center cursor-pointer">{dayjs().format("D")}</div>
        </div>
      </div>
  )
}