import React from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.js';
import { CalendarContext } from '../../Home.js';
import VacationWindow from './VacationWindow.js';

export default function UserCell({day, _user}) {
    const [savedEvents, setSavedEvents] = React.useState([]);
    const { users } = React.useContext(CalendarContext);
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);

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
            
            <div className="bg-blue-200 flex justify-center items-center w-34px h-6 border-gray-100 border-b border-r"
                onClick={() => setShowVacationWindow(true)}>
            {
                savedEvents.map(e => {
                    const sD = new Date(e.startDate);
                    sD.setHours(0, 0, 0, 0);
                    const eD = new Date(e.endDate);
                    eD.setHours(0, 0, 0, 0);
                    const D = new Date(day);
                    sD.setHours(0, 0, 0, 0);

                    return sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && users[_user].uuid === e.uuid && e.type === "Vacation" 
                    ? <div className='absolute w-4 h-4 bg-green-400 rounded-full'></div>
                    : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && users[_user].uuid === e.uuid && e.type === "Unpayed" 
                    ? <div className='absolute w-4 h-4 bg-red-400 rounded-full'></div>
                    : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && users[_user].uuid === e.uuid && e.type === "Sick leave" 
                    ? <div className='absolute w-4 h-4 bg-orange-400 rounded-full'></div>
                    : <div></div>
                })
            }
            </div>
            <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={day}/>
        </div>
    )
}
