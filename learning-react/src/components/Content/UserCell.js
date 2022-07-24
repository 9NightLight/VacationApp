import React from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.js';
import { UsersContext } from './Month.js';

export default function UserCell({day, _user}) {
    const [savedEvents, setSavedEvents] = React.useState([]);
    const { users } = React.useContext(UsersContext);

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
            let e = new Array();
            if (user) {
            onValue(ref(db, `/events`), (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                Object.values(data).map((event) => {
                    e = [...e, event]
                });
                }
                setSavedEvents(e);
            });
            } else if (!user) 
            {

            }
        });
    }, [])

    return (
        <div>
            
            <div className="bg-blue-200 flex justify-center items-center w-34px h-6 border-gray-100 border-b border-r">
            {
                savedEvents.map(e => {
                    return new Date(e.startDate).getTime() <= new Date(day).getTime() && new Date(e.endDate).getTime() >= new Date(day).getTime() && users[_user].uuid === e.uuid 
                    ?
                    <div className='w-4 h-4 bg-red-300 rounded-full'></div>
                    : ""
                    // <div></div>
                })
                
            }
            </div>
        </div>
    )
}
