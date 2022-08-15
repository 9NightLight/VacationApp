import React from "react";
import { CalendarContext } from "../../Home";

export default function Submit({delta}) {
    const {currUser} = React.useContext(CalendarContext)

    return (
        <input className="w-80 h-16 bg-green-apple rounded-xl text-xl font-semibold text-gray-50" type={delta <= currUser.vacationsNum && delta > 0 ? "submit" : "button"} value="Send" />
    )
}