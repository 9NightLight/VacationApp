import React from 'react'
import { CalendarContext } from '../../Home'
import { auth, db } from '../../firebase.js';
import { onValue, ref, update } from 'firebase/database';
import { ROLES } from '../SignIn';
import { iso_to_gcal_description } from '../../utils/GoogleCalendar';

export default function SettingsTab() {
    const {darkTheme, setDarkTheme, currUser, defaultNumVacations, setDefaultNumVacations, setCountryAttribute, countryAttribute} = React.useContext(CalendarContext)
    const vacationsNumRef = React.useRef()

    React.useEffect(() => {
        onValue(ref(db, `rooms/${currUser.room}/settings/`), (snapshot) => {
            const data = snapshot.val()
            if(data !== null)
            {
                setDefaultNumVacations(data.defaultNumVacations)
            }
        })
    }, [])

    const handleChangeDefaultVacations = () => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                if(vacationsNumRef.current.value !== "" && !isNaN(Number(vacationsNumRef.current.value)))
                {
                    auth.onAuthStateChanged(u => {
                        update(ref(db, `rooms/${currUser.room}/settings`), {defaultNumVacations: Number(vacationsNumRef.current.value)})
                        .then(setDefaultNumVacations(vacationsNumRef.current.value))
                        .then(vacationsNumRef.current.value = "")
                    })
                } 
                else 
                {
                    vacationsNumRef.current.value = ""
                }
            }
        })
    }

    const handleVacationNumChange = (event) => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                const a = Object.values(iso_to_gcal_description).find(val => {
                    if(val.attr === event.target.value) return true
                })
                update(ref(db, `rooms/${currUser.room}/settings/country`), {
                                                                            attr: a.attr,
                                                                            country: a.country
                })
                .then(setCountryAttribute(a))
            }
        })
    }

    return (
        <div className='w-120 h-96 flex justify-center'>
            <div className='relative w-4/5 h-5/6 bg-main-gray rounded-xl pl-4 pr-4 pt-4 pb-4'>
                <div className='w-full h-full flex flex-col'>
                    <div className='flex items-center justify-between w-full h-10 mt-2 font-bold text-white'>
                        <div>Dark theme</div>
                        <div className={darkTheme ? 'w-12 h-6 bg-black rounded-xl flex justify-end' : 'w-12 h-6 bg-white rounded-xl flex justify-start'}>
                            <div className={darkTheme ? 'w-1/2 h-full rounded-full bg-white' : 'w-1/2 h-full rounded-full bg-black'} onClick={() => setDarkTheme(!darkTheme)}></div>
                        </div>
                    </div>
                    {currUser.role === ROLES.HRMANAGER || currUser.role === ROLES.ADMIN ? 
                        <div>
                            <div className='flex items-center justify-between w-full h-10 mt-2 font-bold text-white'>
                                <div>Default number vacate days</div>
                                <input type="text" ref={vacationsNumRef} className="w-8 h-6 bg-gray-200 text-black/50 text-center" placeholder={defaultNumVacations} onBlur={handleChangeDefaultVacations}></input>
                            </div>
                            <div className='flex justify-between'>
                                <div className='font-bold text-white'>Coutry: </div>
                                <select onChange={(event) => handleVacationNumChange(event)} defaultValue={countryAttribute.attr} className="w-fit l-4 h-5 flex justify-center text-black items-center bg-gray-200">
                                    {
                                        Object.values(iso_to_gcal_description).map(val => {return <option value={val.attr}>{val.country}</option>})
                                    }
                                </select>
                            </div>
                        </div>
                        : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}
