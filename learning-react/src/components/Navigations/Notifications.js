import React from 'react';
import { CalendarContext } from '../../Home';
import Notify from './Notify';
import { db, auth } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import VacationsAsk from './VacationsAsk';
import { ROLES } from '../SignIn';

export default function Notifications({tab}) {
    const {users, currUser, roomUsers, invites, setInvites, vacations, setVacations} = React.useContext(CalendarContext)

    // React.useEffect(() => {
    //   auth.onAuthStateChanged((user) => {
    //     if (user) {
    //       let arr = new Array()
    //       users.find((_user) => {
    //         onValue(ref(db, `/rooms/${_user.uuid}/pending/emailArray`), (snapshot) => {
    //           const data = snapshot.val();
    //           if(data !== null)
    //           {
    //             Object.values(data).map((val) => {
    //               if(val === currUser.email)
    //               {
    //                 arr = [...arr, _user.uuid]
    //               }
    //             })
    //             setInvites(arr);
    //           }
    //         })
    //       });
    //       onValue(ref(db, `/rooms/${currUser.room}/events/pending`), (snapshot) => {
    //         const data = snapshot.val();
    //         let arr = new Array()
    //         if(data !== null)
    //         {
    //           Object.values(data).map((val) => {
    //             arr = [...arr, val]
    //           })
    //           setVacations(arr)
    //         }
    //       })
    //     }
    //   });
    // }, [tab]);

    return (
      <div className='ml-4 flex flex-col w-192 h-full'>
        <div className='h-fit flex flex-col mb-4'>
          <div className='font-bold text-2xl mb-4'>Invites</div>
          {
            invites.map((val, idx) => {
              return <Notify uuid={val} key={idx} invites={invites} setInvites={setInvites}/>
            })
          }
        </div>
        {currUser.role === ROLES.HRMANAGER || currUser.role === ROLES.ADMIN ?
        <div>
          <div className='font-bold text-2xl mb-4'>Vacations</div>
            {
              vacations.map((val, idx) => {
                return <VacationsAsk vacation={val} key={idx} setVacations={setVacations} vacations={vacations}/>
              })
            }
          </div>
          : ""
        }     
      </div>
    )
}
