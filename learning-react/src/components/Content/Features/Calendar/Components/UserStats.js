import React from 'react'
import { CalendarContext } from '../../../../../Home'



const UNPAID_VACATIONS_STATS = {
    CONTAINER: 'w-20 h-20 border-8 border-red-apple rounded-full flex justify-center items-center'
}

const SICK_LEAVES_STATS = {
    CONTAINER: 'w-20 h-20 border-8 border-orange-apple rounded-full flex justify-center items-center'
}



export default function UserStats({user, show}) {
    const {defaultNumVacations} = React.useContext(CalendarContext)

    const TAIL_STYLES = () => {
        if(user !== null)
        {
            const deg = -135 + Math.round(360 * user.vacationsNum / defaultNumVacations / 15) * 15;

            return { 
                    ROTATE: deg,
                    CONTAINER: 'w-20 h-20 border-8 border-gray-200 rounded-full flex justify-center items-center',
                    SECOND_PROGRESS_LAYER: deg < 45 ? "" : 'absolute w-20 h-20 border-8 rounded-full border-l-transparent border-b-transparent border-r-green-apple border-t-green-apple flex justify-center items-center rotate-45',
                    OFFSET_LAYER: deg > 45 ? "" : 'absolute w-20 h-20 border-8 rounded-full border-l-transparent border-b-transparent -rotate-135',
            }
        }
    }

    const PROGRESS_LAYER = user ? {
        width: "5rem",
        height: "5rem",
        display: "absolute",
        borderWidth: "8px",
        borderRadius: 100,
        position: 'absolute',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: "#62C554",
        borderTopColor: "#62C554",
        transform: `rotate(${TAIL_STYLES().ROTATE}deg)`
    } : "";

    return (
        <div>
            {
                show ? 
                <div className="absolute left-0 top-0 w-full h-full flex justify-end sm:justify-center items-center">
                    <div className='relative w-40 h-96 sm:w-96 sm:h-40 bg-white shadow-2xl rounded-lg flex flex-col sm:flex-row justify-around items-center'>
                        <div className='h-5/6 flex flex-col justify-around items-center'>
                            <div className='font-bold'>Vacation</div>
                            <div className={TAIL_STYLES().CONTAINER}>
                                <div style={PROGRESS_LAYER} />
                                <div className={TAIL_STYLES().OFFSET_LAYER} />
                                <div className={TAIL_STYLES().SECOND_PROGRESS_LAYER} />
                                <div>{ user ? user.vacationsNum : ""}/{defaultNumVacations}</div>
                            </div>
                        </div>
                        <div className='h-5/6 flex flex-col justify-around items-center'>
                            <div className='font-bold'>Unpaid</div>
                            <div className={UNPAID_VACATIONS_STATS.CONTAINER}>
                                <div>{ user ? user.unpaidVacationDays : ""}</div>
                            </div>
                        </div>
                        <div className='h-5/6 flex flex-col justify-around items-center'>
                            <div className='font-bold'>Sick</div>
                            <div className={SICK_LEAVES_STATS.CONTAINER}>
                                <div>{ user ? user.sickLeaves : ""}</div>
                            </div>
                        </div>
                    </div>
                </div>
                : ""
            }
        </div>
    )
}



