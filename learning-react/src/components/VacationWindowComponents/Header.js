import React from "react";
import { CalendarContext } from "../../Home";

export default function Header({delta}) {
    const { currUser } = React.useContext(CalendarContext)

    return (
        <div className="w-full h-20 flex justify-between text-2xl font-bold pl-2 pr-2">
            <div>Take Vacation!</div>
            <div className="flex flex-col items-end">
                <div>Left: { currUser.vacationsNum } {currUser.vacationsNum !== 1 ? "days" : "day"}</div>
                <div className="text-red-500">{delta !== 0 ? `${delta}` : delta === 0 ? delta : ""}</div>
                <div className="text-xs text-red-500">{delta * -1 > currUser.vacationsNum ? "You don't have enough vacations!" : ""}</div>
            </div>
        </div>
    )
}