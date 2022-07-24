import React from "react";
import Day from "./CalendarParts/Day";
import UsersCalendar from "./UsersCalendar";
import UserCell from "./UserCell";

export const UsersContext = React.createContext();

export default function Month({ month }) {
  const [users, setUsers] = React.useState(new Array());

  return (
    <div className="ml-40 w-fit h-fit grid grid-cols-35"> {/* I can change {w, h} to set calendar sizes*/ }
    <div className="absolute flex flex-col left-12 mt-34px">
      <UsersContext.Provider value={{users, setUsers}}>
        <UsersCalendar/>
      </UsersContext.Provider>
    </div>

    
      {month.map((day, idx) => (
        <React.Fragment key={idx}>
              <div className="flex flex-col">
                <Day day={day} />
                <UsersContext.Provider value={{users, setUsers}}>
                  {users.map((val, id) => {
                    return <UserCell day={day} _user={id}/>
                  })}
                </UsersContext.Provider>
              </div>
        </React.Fragment>
      ))
      }
    
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