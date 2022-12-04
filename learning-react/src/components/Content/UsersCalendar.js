import React from 'react';
import { auth, db } from "../../firebase";
import { onValue, ref, set } from 'firebase/database';
import { CalendarContext } from '../../Home';

export default function UsersCalendar({setOnHoldUser}) {
    const {setUsers, currUser, setCurrUser, roomUsers, setRoomUsers, setDefaultNumVacations, setCountryAttribute, setDownloaded, setIsRoomActive} = React.useContext(CalendarContext);

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            
            setDownloaded(false)
            onValue(ref(db, `/users`), (snapshot) => {
                let sArray = new Array();
                const data = snapshot.val();
                if(data !== null)
                {
                    Object.values(data).map((_user) => {
                        sArray = [...sArray, {  firstName:      _user.firstName, 
                                                lastName:       _user.lastName, 
                                                vacationsNum:   _user.vacationsNum, 
                                                unpaidVacationDays: _user.unpaidVacationDays,
                                                sickLeaves:     _user.sickLeaves,
                                                role:           _user.role,
                                                email:          _user.email,
                                                room:           _user.room,
                                                uuid:           _user.uuid          }]
                        if(user.uid === _user.uuid)
                        {
                            setCurrUser({
                                firstName:_user.firstName,
                                lastName: _user.lastName,
                                vacationsNum: _user.vacationsNum, 
                                unpaidVacationDays: _user.unpaidVacationDays,
                                sickLeaves: _user.sickLeaves,
                                role: _user.role,
                                email: _user.email,
                                room: _user.room,
                                uuid:_user.uuid
                            })
                        }
                    });
                    sArray.sort(((a, b) => {
                        let fa = a.firstName.toLowerCase() + a.lastName.toLowerCase(),
                            fb = b.firstName.toLowerCase() + b.lastName.toLowerCase();
                        return fa < fb ? -1 : fa > fb ? 1 : 0;
                        }));
                    setUsers(sArray)
                }
            });
          } 
          else if (!user) {
    
            }
        });
    }, []);

    React.useEffect(()=> {
        auth.onAuthStateChanged(user => {
            if(user) {
                onValue(ref(db, `/rooms/${currUser.room}/members`), (snapshot) => {
                    let rUsers = new Array();
                    const data = snapshot.val()
                    if(data !== null)
                    {
                        Object.values(data).map((val)=> {
                            rUsers = [...rUsers, val]
                        })
                        rUsers.sort(((a, b) => {
                            let fa = a.firstName.toLowerCase() + a.lastName.toLowerCase(),
                                fb = b.firstName.toLowerCase() + b.lastName.toLowerCase();
                            return fa < fb ? -1 : fa > fb ? 1 : 0;
                        }));
                        setRoomUsers(rUsers);
                    }
                })
                onValue(ref(db, `rooms/${currUser.room}/settings/`), (snapshot) => {
                    const data = snapshot.val()
                    if(data !== null)
                    {
                        setDefaultNumVacations(data.defaultNumVacations)
                    }
                })
                // onValue(ref(db, `rooms/${currUser.room}/settings/`), (snapshot) => {
                //     const data = snapshot.val()
                //     if(data !== null)
                //     {
                //         setIsRoomActive(data.isRoomActive)
                //     }
                // })
                onValue(ref(db, `rooms/${currUser.room}/settings/country`), (snapshot) => {
                    const data = snapshot.val()
                    if(data !== null)
                    {
                        setCountryAttribute({attr: data.attr, country: data.country})
                    }
                })
            }
        })
    }, [currUser])

    return (
        <div className='ml-3'>
            {
                roomUsers.map((val, idx) => {
                    let u = val.lastName + ", " + val.firstName;
                    if(u.length > 20) 
                    {
                        u = u.slice(0,20);
                    }
                    return  <div>
                                <div className='cursor-default' onMouseEnter={() => setOnHoldUser(val)} onMouseOut={() => setOnHoldUser(null)} key={idx}>{u}</div>
                            </div>
                })
            }
        </div>
    )
}
