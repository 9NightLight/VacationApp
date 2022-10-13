import React from "react";
import { CalendarContext } from "../../../Home";
import { VACATION_TYPE } from "../VacationWindow";

export default function Header({delta, type}) {
    const { currUser } = React.useContext(CalendarContext)

    return (
        <div className="w-full h-20 flex justify-between text-2xl font-bold pl-2 pr-2">
            <div>Take Vacation!</div>
            <div className="flex flex-col items-end">
                {type === VACATION_TYPE.VACATION ?<div>Left: { currUser.vacationsNum } {currUser.vacationsNum !== 1 ? "days" : "day"}</div> : ""}
            </div>
        </div>
    )
}