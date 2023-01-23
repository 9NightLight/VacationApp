import React from "react";
import Day from "../CalendarHeader/CHWeekDay";
import UsersCalendar from "./UsersListCalendar";
import UserCell from "./UserCells";
import { CalendarContext } from "../../../../Home";
import UserStats from "../Features/UserStats";

export default function Month({ month }) {
  const {roomUsers} = React.useContext(CalendarContext)
  const [onHoldUser, setOnHoldUser] = React.useState(null)

  return (
    <div>
      <div className="w-fit h-fit grid grid-cols-35"> {/* I can change {w, h} to set calendar sizes*/ }
      
        {/* <div className="absolute z-10 flex flex-col h-fit left-12 mt-50px ">
            <UsersCalendar setOnHoldUser={setOnHoldUser}/>
        </div> */}
        
        <div className=" w-to-calendar--90px overflow-x-scroll flex ml-2">
        <div className="relative w-48 h-96 flex whitespace-nowrap mr-2 z-10 mt-50px"><UsersCalendar setOnHoldUser={setOnHoldUser}/></div>
        <div className="flex w-0">
          { month.map((day, idx) => (
              <React.Fragment key={idx}>
                    <div className="flex flex-col">
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