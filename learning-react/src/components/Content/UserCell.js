import React from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.js';
import { CalendarContext } from '../../Home.js';
import VacationWindow from './VacationWindow.js';

export default function UserCell({day, _user}) {
    const [savedEvents, setSavedEvents] = React.useState(new Array()); // previous - new Array([])
    const [unconfirmedEvents, setUnconfirmedEvents] = React.useState(new Array()); 
    const { currUser, roomUsers } = React.useContext(CalendarContext);
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
            let confirmed = new Array();
            if (user) {
                onValue(ref(db, `/rooms/${currUser.room}/events/confirmed/`), (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                    Object.values(data).map((event) => {
                        confirmed = [...confirmed, event]
                    });
                    setSavedEvents(confirmed);
                    }
                })
            let unconfirmed = new Array();
                onValue(ref(db, `/rooms/${currUser.room}/events/pending/`), (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                    Object.values(data).map((event) => {
                        unconfirmed = [...unconfirmed, event]
                    });
                    setUnconfirmedEvents(unconfirmed);
                    }
                });

            } 
        });
    }, [])

    return (
        <div>
            {new Date(day).getDay() !== 6 && new Date(day).getDay() !== 0 ? 
                <div className="relative bg-blue-200 flex justify-center items-center w-34px h-6 border-gray-100 border-b border-r" 
                    onClick={() => setShowVacationWindow(true)}>
                        {
                        savedEvents.map(e => {
                            const sD = new Date(e.startDate);
                            sD.setHours(0, 0, 0, 0);
                            const eD = new Date(e.endDate);
                            eD.setHours(0, 0, 0, 0);
                            const D = new Date(day);
                            sD.setHours(0, 0, 0, 0);

                            return sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === "Vacation" 
                            ? <div className='absolute w-4 h-4 bg-green-500 rounded-full'></div>
                            : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === "Unpayed" 
                            ? <div className='absolute w-4 h-4 bg-red-500 rounded-full'></div>
                            : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === "Sick leave" 
                            ? <div className='absolute w-4 h-4 bg-orange-500 rounded-full'></div>
                            : null
                        })
                        }
                        {
                            unconfirmedEvents.map(e => {
                                const usD = new Date(e.startDate);
                                usD.setHours(0, 0, 0, 0);
                                const ueD = new Date(e.endDate);
                                ueD.setHours(0, 0, 0, 0);
                                const D = new Date(day);
                                usD.setHours(0, 0, 0, 0);
                                
                                return usD.getTime() <= D.getTime() && ueD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === "Vacation" 
                                ? <div className='absolute w-full h-full bg-green-200/50 flex justify-center items-center'><div className='absolute w-4 h-4 bg-green-500/30 rounded-full'></div></div>
                                : usD.getTime() <= D.getTime() && ueD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === "Unpayed" 
                                ? <div className='absolute w-full h-full bg-red-200/50 flex justify-center items-center'><div className='absolute w-4 h-4 bg-red-500/30 rounded-full'></div></div>
                                : usD.getTime() <= D.getTime() && ueD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === "Sick leave" 
                                ? <div className='absolute w-full h-full bg-orange-200/50 flex justify-center items-center'><div className='absolute w-4 h-4 bg-orange-500/30 rounded-full'></div></div>
                                : <div></div>
                            })
                            
                        }
                        </div>
            : 
                <div className="relative bg-red-200 flex justify-center items-center w-34px h-6 border-gray-100 border-b border-r"
                onClick={() => setShowVacationWindow(true)}></div>
            }
            <VacationWindow show={ShowVacationWindow} setShow={setShowVacationWindow} date={day}/>
        </div>
    )
}
