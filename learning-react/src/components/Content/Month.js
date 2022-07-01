import React from "react";
import Day from "./CalendarParts/Day";

export default function Month({ month }) {
  return (
    <div className="ml-2 w-192 h-96 grid grid-cols-7 grid-rows-5"> {/* I can change {w, h} to set calendar sizes*/ }
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day day={day} key={idx} rowIdx={i} />
          ))} 
        </React.Fragment>
      ))}
    </div>
  );
}