import React from "react";
import { VACATION_TYPE } from "../CalendarParts/Features/BookVacationWindow";

export default function TypeVacation({setType}) {

    return (
        <React.Fragment>
            <div>
                <p className="text-base font-bold">Choose type vacation</p>
                <select onChange={(event) => setType(event.target.value)} defaultValue={"Unpayed"} className="w-80 h-8 flex justify-center items-center bg-gray-200">
                    <option value={VACATION_TYPE.VACATION}>Vacation</option>
                    <option value={VACATION_TYPE.UNPAID} >Unpayed</option>
                    <option value={VACATION_TYPE.SICK_LEAVE}>Sick leave</option>
                    <option value={VACATION_TYPE.STUDY}>Study</option>
                </select>
            </div>
        </React.Fragment>
    )
}