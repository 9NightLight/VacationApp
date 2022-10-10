import React from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.js';
import { CalendarContext } from '../../Home.js';
import VacationWindow, { VACATION_TYPE } from './VacationWindow.js';


const axios = require("axios").default;

const mykey = "AIzaSyC1NrF3Y0Ze7yMViWSLuP4ITmX7WYzlhec"

const BASE_CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars";
const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY = "holiday@group.v.calendar.google.com"; // Calendar Id. This is public but apparently not documented anywhere officialy.

export default function UserCell({day, _user}) {
    const [unconfirmedEvents, setUnconfirmedEvents] = React.useState(new Array()); 
    const { currUser, roomUsers, countryAttribute, savedEvents, setSavedEvents, downloaded, setDownloaded} = React.useContext(CalendarContext);
    const [ShowVacationWindow, setShowVacationWindow] = React.useState(false);
    const [nationHolidays, setNationHolidays] = React.useState(new Array()); 

    React.useEffect(() => {
        setDownloaded(false)
        const CALENDAR_REGION = `en.${countryAttribute.attr}`;
        const calendar_url = `${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${mykey}`
        let holidaysArray = new Array()

        axios.get(calendar_url)
        .then(res => {res.data.items.map(val => {
                const sD = new Date(new Date(val.start.date).setHours(0, 0, 0, 0))
                const eD = new Date(new Date(val.end.date).setHours(0, 0, 0, 0))
                eD.setDate(eD.getDate() - 1)

                holidaysArray = [...holidaysArray, {startDate: sD,
                                                endDate: eD, 
                                                description: val.summary, 
                                                type: VACATION_TYPE.HOLIDAY}
                ]
            })
            setNationHolidays(holidaysArray)
            setDownloaded(true)
        })
        .catch(err => console.log(err))
    }, [countryAttribute])

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
            let confirmed = new Array();
            if (user) {
                onValue(ref(db, `/rooms/${currUser.room}/events/confirmed/`), (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                    Object.values(data).map((event) => {
                        confirmed = [...confirmed, event]
                    })
                }})
                nationHolidays.map(val => confirmed = [...confirmed, val])
                setSavedEvents(confirmed)
                
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
                setDownloaded(true)
            } 
        });
    }, [nationHolidays])

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
                            D.setHours(0, 0, 0, 0);

                            return sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === VACATION_TYPE.VACATION 
                            ? <div className='absolute w-4 h-4 bg-green-500 rounded-full'></div>
                            : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === VACATION_TYPE.UNPAID 
                            ? <div className='absolute w-4 h-4 bg-red-500 rounded-full'></div>
                            : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === VACATION_TYPE.SICK_LEAVE 
                            ? <div className='absolute w-4 h-4 bg-orange-500 rounded-full'></div>
                            : sD.getTime() <= D.getTime() && eD.getTime() >= D.getTime() && e.type === VACATION_TYPE.HOLIDAY 
                            ? <div className='absolute w-4 h-4 bg-blue-500 rounded-full'></div>
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
                                
                                return usD.getTime() <= D.getTime() && ueD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === VACATION_TYPE.VACATION 
                                ? <div className='absolute w-full h-full bg-green-200/50 flex justify-center items-center'><div className='absolute w-4 h-4 bg-green-500/30 rounded-full'></div></div>
                                : usD.getTime() <= D.getTime() && ueD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === VACATION_TYPE.UNPAID 
                                ? <div className='absolute w-full h-full bg-red-200/50 flex justify-center items-center'><div className='absolute w-4 h-4 bg-red-500/30 rounded-full'></div></div>
                                : usD.getTime() <= D.getTime() && ueD.getTime() >= D.getTime() && roomUsers[_user].uuid === e.uuid && e.type === VACATION_TYPE.SICK_LEAVE 
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
