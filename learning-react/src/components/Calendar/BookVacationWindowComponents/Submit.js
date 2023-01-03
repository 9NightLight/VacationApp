import React from "react";
import { CalendarContext } from "../../../Home";
import { VACATION_TYPE } from "../CalendarParts/Features/BookVacationWindow";

export default function Submit({delta, type}) {
    const {currUser} = React.useContext(CalendarContext)

    return (
        <input className="w-80 h-16 bg-green-apple rounded-xl text-xl font-semibold text-gray-50" type={type === VACATION_TYPE.VACATION ? delta <= currUser.vacationsNum && delta > 0 ? "submit" : "button" : delta > 0 ? "submit" : "button"} value="Submit for review" />
    )
}