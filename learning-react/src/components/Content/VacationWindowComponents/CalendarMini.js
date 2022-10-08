import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarMini({clickedDate, setDates}) {
    const [dayRange, setDayRange] = React.useState(new Array(new Date(clickedDate), new Date(clickedDate)))
    const [ShowCalendar, setShowCalendar] = React.useState(false)
    
    const GetStringDate = (date = new Date()) => { // Make Vacation display 
        return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear()
    }

    React.useEffect(() => {
        setShowCalendar(false)
        setDates(new Array(new Date(dayRange[0]), new Date(dayRange[1])))
    }, [dayRange])
        
    return (
        <React.Fragment>
            <div className="relative w-full h-full text-2xl font-bold flex items-center justify-between cursor-default" onClick={() => setShowCalendar(!ShowCalendar)}>
                <div>Date:</div>
                { GetStringDate(dayRange[0]) === GetStringDate(dayRange[1]) ? 
                    <div className="w-2/3 h-4/6 text-base bg-gray-200 text-gray-500 rounded-sm flex justify-center items-center border-2 border-gray-300">{GetStringDate(dayRange[0])}</div>
                    :
                    <div className="w-fit h-4/6 text-base bg-gray-200 text-gray-500 rounded-sm flex justify-center items-center border-2 border-gray-300">{"from " + GetStringDate(dayRange[0]) + " to " + GetStringDate(dayRange[1])}</div>
                }
            </div>
            {ShowCalendar === false ? "" 
            :
                <div>
                    <div className='absolute w-full h-full left-0 top-0 flex justify-center items-center'>
                        <div className="absolute w-80 h-96 flex justify-center items-center">
                            <Calendar onChange={setDayRange} value={dayRange} selectRange className="w-fit h-fit z-20 bg-black"/>
                        </div>
                    </div>
                    <div onClick={() => setShowCalendar(false)} className="absolute w-full h-full left-0 top-0"></div>
                </div>
            }
            
        </React.Fragment>
    )
}
