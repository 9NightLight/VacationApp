import React from 'react';
import { CalendarContext } from '../../Home';
import Notify from './Notify';
import { db, auth } from '../../firebase';
import { ref, onValue } from 'firebase/database';

export default function Notifications() {
    const {users, currUser} = React.useContext(CalendarContext)
    const [invites, setInvites] = React.useState(new Array())

    React.useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          let arr = new Array()
          users.find((_user) => {
            
            onValue(ref(db, `/rooms/${_user.uuid}/pending/emailArray`), (snapshot) => {
              const data = snapshot.val();
              Object.values(data).map((val) => {
                if(val === currUser.email)
                {
                  arr = [...arr, _user.uuid]
                }
              })
              setInvites(arr);
            })
          });
        }
      });
    }, []);

    return (
      <div className='ml-4'>
        <div className='font-bold text-2xl mb-4'>Invites</div>
          {
            invites.map((val, idx) => {
              return <Notify uuid={val} key={idx}/>
            })
          }
      </div>
    )
}
