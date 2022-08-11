import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TransitionComponent from "../TransitionComponent";

export default function CalendarMini({clickedDate, setDates}) {
    const [dayRange, setDayRange] = React.useState(new Array(new Date(clickedDate), new Date(clickedDate)))
    const [ShowCalendar, setShowCalendar] = React.useState(false)
    
    function GetStringDate(date = new Date()) { // Make Vacation display 
        return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear()
    }

    React.useEffect(() => {
        setShowCalendar(false)
        setDates(new Array(new Date(dayRange[0]), new Date(dayRange[1])))
    }, [dayRange])
        
    return (
        <React.Fragment>
            {/* Guess I should change icon on two bordered boxes with displaying dates */}
            <div className="relative w-full h-full text-2xl font-bold flex items-center justify-between cursor-default" onClick={() => setShowCalendar(!ShowCalendar)}>
                <div>Date:</div>
                <div className="w-1/3 h-4/6 text-base bg-gray-200 text-gray-500 rounded-sm flex justify-center items-center border-2 border-gray-300">{GetStringDate(dayRange[0])}</div>
                <div className="w-1/3 h-4/6 text-base bg-gray-200 text-gray-500 rounded-sm flex justify-center items-center border-2 border-gray-300">{GetStringDate(dayRange[1])}</div>
            </div>
            <TransitionComponent 
            content={
                <div className="absolute w-80 h-96 flex justify-center items-center right-40 bottom-0">
                    <Calendar onChange={setDayRange} value={dayRange} selectRange className="w-fit h-fit z-20 bg-black"/>
                </div>
            }
            show={ShowCalendar}/>
            <TransitionComponent 
                content = {
                    <div onClick={() => setShowCalendar(false)} className="absolute w-full h-full left-0 top-0"></div>
                }
            show={ShowCalendar}/>
            
        </React.Fragment>
    )
}
