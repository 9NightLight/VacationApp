import React from 'react';
import { CalendarContext } from '../../Home';
import Notify from './Notify';
import { db, auth } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import VacationsAsk from './VacationsAsk';

export default function Notifications() {
    const {users, currUser} = React.useContext(CalendarContext)
    const [invites, setInvites] = React.useState(new Array())
    const [vacations, setVacations] = React.useState(new Array())

    React.useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          let arr = new Array()
          users.find((_user) => {
            onValue(ref(db, `/rooms/${_user.uuid}/pending/emailArray`), (snapshot) => {
              const data = snapshot.val();
              if(data !== null)
              {
                Object.values(data).map((val) => {
                  if(val === currUser.email)
                  {
                    arr = [...arr, _user.uuid]
                  }
                })
                setInvites(arr);
              }
            })
          });
          onValue(ref(db, `/rooms/${currUser.room}/events/pending`), (snapshot) => {
            const data = snapshot.val();
            let arr = new Array()
            if(data !== null)
            {
              Object.values(data).map((val) => {
                arr = [...arr, val]
              })
              setVacations(arr)
            }
          })
        }
      });
    }, []);

    return (
      <div className='ml-4 flex justify-between w-192 h-full'>
        <div>
          <div className='font-bold text-2xl mb-4'>Vacations</div>
          {
            vacations.map((val, idx) => {
              return <VacationsAsk vacation={val} key={idx} />
            })
          }
        </div>
        <div className='flex flex-col'>
          <div className='font-bold text-2xl mb-4'>Invites</div>
          {
            invites.map((val, idx) => {
              return <Notify uuid={val} key={idx} invites={invites} setInvites={setInvites}/>
            })
          }
        </div>
      </div>
    )
}
