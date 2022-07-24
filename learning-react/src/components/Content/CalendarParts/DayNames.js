import React from "react";

export default function DayNames() {
    const NameDay = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    const listItems = NameDay.map((day, idx) =>
        <div key={idx} className=" h-full flex justify-center items-center w-34px text-xs">
            {day}
        </div>
    );

    return (
        <div className="ml-40 w-fit h-6 flex">
            {listItems}
        </div>
    )
}