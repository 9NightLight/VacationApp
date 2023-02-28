import React from "react";
import Day from "../CalendarHeader/CHWeekDay";
import UsersListCalendar from "./UsersListCalendar";
import UserCell from "./UserCells";
import { CalendarContext } from "../../../../Home";
import UserStats from "../Features/UserStats";

export default function Month({ month }) {
  const {roomUsers} = React.useContext(CalendarContext)
  const [onHoldUser, setOnHoldUser] = React.useState(null)

  return (
    <div>
      <div style={{width: "calc(100vw - 160px)"}} className="relative w-fit h-fit grid grid-cols-35"> {/* I can change {w, h} to set calendar sizes*/ }
        
        <div style={{marginLeft: "6.5px", width: "calc(100vw - 6px)"}} className="overflow-x-scroll flex justify-between">
          <div style={{paddingTop: "45.5px", width: "144px"}} className=" bg-gray-100 flex whitespace-nowrap z-10 absolute"><UsersListCalendar setOnHoldUser={setOnHoldUser}/></div>
          <div style={{width: "calc(100vw - 150px)"}} className="flex ml-40">
            { month.map((day, idx) => (
                <React.Fragment key={idx}>
                      <div className="flex flex-col ">
                        <div className="relative"><Day day={day} /></div>
                          {roomUsers.map((val, id) => {
                            return <UserCell day={day} _user={id}/>
                          })}
                      </div>
                </React.Fragment>
              ))
            }
          </div>
        </div>
      </div>
      <UserStats show={onHoldUser} user={onHoldUser}/>
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