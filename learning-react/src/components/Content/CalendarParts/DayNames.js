import React from "react";

export default function DayNames() {
    const NameDay = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    const listItems = NameDay.map((day) =>
        <div key={day.toString()} className="w-192/7 h-full flex justify-center">
            {day}
        </div>
    );

    return (
        <div className="ml-2 w-192 h-6 flex">
            {listItems}
        </div>
    )
}