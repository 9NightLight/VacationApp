import React from 'react';
import { auth, db } from "../../firebase";
import { onValue, ref } from 'firebase/database';
import { CalendarContext } from '../../Home';

export default function UsersCalendar() {
    const {users, setUsers, currUser, setCurrUser} = React.useContext(CalendarContext);

    React.useEffect(() => {
        let sArray = new Array();
        auth.onAuthStateChanged((user) => {
          if (user) {
            onValue(ref(db, `/users`), (snapshot) => {
                let sArray = new Array();
                const data = snapshot.val();
                Object.values(data).map((_user) => {
                    sArray = [...sArray, {firstName:_user.firstName, 
                                            lastName: _user.lastName, 
                                            vacationsNum: _user.vacationsNum, 
                                            role: _user.role,
                                            uuid:_user.uuid} ]
                    if(user.uid === _user.uuid)
                    {
                        setCurrUser({firstName:_user.firstName, 
                            lastName: _user.lastName, 
                            vacationsNum: _user.vacationsNum, 
                            role: _user.role,
                            uuid:_user.uuid})
                    }
                });
                sArray.sort(((a, b) => {
                    let fa = a.firstName.toLowerCase() + a.lastName.toLowerCase(),
                        fb = b.firstName.toLowerCase() + b.lastName.toLowerCase();
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0
                }));
                setUsers(sArray)
            });
          } 
          else if (!user) {
    
          }
        });
    }, []);

    return (
        <div>
            {
                users.map((val, idx) => {
                    let u = val.lastName + ", " + val.firstName;
                    if(u.length > 20) 
                    {
                        u = u.slice(0,20);
                    }
                    return <div key={idx}>{u}</div>
                })
            }
        </div>
    )
}
