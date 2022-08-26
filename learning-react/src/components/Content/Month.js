import React from "react";
import Day from "./CalendarParts/Day";
import UsersCalendar from "./UsersCalendar";
import UserCell from "./UserCell";
import { CalendarContext } from "../../Home";

export default function Month({ month }) {
  const {roomUsers} = React.useContext(CalendarContext)

  return (
    <div className="w-fit h-fit grid grid-cols-35 ml-44"> {/* I can change {w, h} to set calendar sizes*/ }
    
      <div className="absolute flex flex-col left-12 mt-50px">
          <UsersCalendar/>
      </div>
      
      <div className="w-to-calendar overflow-x-auto h-fit flex">
      { month.map((day, idx) => (
          <React.Fragment key={idx}>
                <div className="flex flex-col">
                  <Day day={day} />
                    {roomUsers.map((val, id) => {
                      return <UserCell day={day} _user={id}/>
                    })}
                </div>
          </React.Fragment>
        ))
      }
      </div>
    </div>
  );
}

// Normal 7x5 calendar

// <div className="ml-2 w-192 h-96 grid grid-cols-7 grid-rows-5"> {/* I can change {w, h} to set calendar sizes*/ }
//   {month.map((row, i) => (
//     <React.Fragment key={i}>
//       {row.map((day, idx) => (
//         <Day day={day} key={idx} rowIdx={i} />
//       ))} 
//     </React.Fragment>
//   ))}
// </div>