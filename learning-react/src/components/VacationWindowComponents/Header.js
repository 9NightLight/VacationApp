import React from "react";
import { CalendarContext } from "../../Home";

export default function Header() {
    const { currUser } = React.useContext(CalendarContext)

    return (
        <div className="w-full h-20 flex justify-between text-2xl font-bold pl-2 pr-2">
            <div>Take Vacation!</div>
            <div>Left: {
                currUser.vacationsNum
            } {currUser.vacationsNum !== 1 ? "days" : "day"}</div>
        </div>
    )
}