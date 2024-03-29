import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate} from "@fortawesome/free-solid-svg-icons"
import { faUserMinus} from "@fortawesome/free-solid-svg-icons"
import React from 'react';
import { CalendarContext } from '../../Home';
import { onValue, ref, update } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import { ROLES } from '../Registation/SignIn';
import RefreshWindow from '../../utils/Members/RefreshWindow';
import ConfirmFireMemberWindow from '../../utils/Members/ConfirmFireMemberWindow';
import UserVacateDays from '../../utils/Members/MemberVacationDaysAndEdit';

export default function Members() {
    const { roomUsers, currUser, setDefaultNumVacations } = React.useContext(CalendarContext)
    const [showRefreshConfirm, SetShowRefreshConfirm] = React.useState(false)
    const [showFireConfirmWindow, setShowFireConfirmWindow] = React.useState(false)
    const [onFireMember, setOnFireMember] = React.useState(null)

    React.useEffect(() => {
        onValue(ref(db, `rooms/${currUser.room}/settings/`), (snapshot) => {
            const data = snapshot.val()
            if(data !== null)
            {
                setDefaultNumVacations(data.defaultNumVacations)
            }
        })
    }, [])

    const handleVacationNumChange = (event, _u) => {
        auth.onAuthStateChanged(user => {
            if(user)
            {
                update(ref(db, `/users/${_u.uuid}`), {
                    role: event.target.value
                })
                .then(update(ref(db, `/rooms/${currUser.room}/members/${_u.uuid}`), {
                    role: event.target.value
                }))
                .catch(err => console.log(err))
            }
        })
    }

    return (
        <React.Fragment>
            <div className='flex justify-start w-192 ml-2'>
            <table className='flex-1 h-0 bg-main-gray text-gray-100'>
                <tr className='h-10 text-center border-b'>
                    <td className='w-2/5 text-start'>User</td>
                    <td className='w-1/5'>Role</td>
                    <td className='w-2/5'>Vacations</td>
                    { currUser.role === ROLES.HRMANAGER || currUser.role === ROLES.ADMIN ? 
                        <td onClick={() => SetShowRefreshConfirm(true)} className='w-10 h-10 bg-white flex justify-center items-center ml-2 rounded-full cursor-pointer' title='Refresh vacations'>
                            <FontAwesomeIcon className='w-4 h-4 flex text-center justify-center items-center text-black' icon={faArrowsRotate} />
                        </td>
                        : ""
                    }
                </tr>
                {
                    roomUsers.map((cellsUser, idx) => {
                        let u = cellsUser.lastName + ", " + cellsUser.firstName;
                        if(u.length > 20) 
                        {
                            u = u.slice(0,20);
                        }
                        return <tr key={idx} className='h-10 text-center'>
                            <td  className='w-2/5 text-start'>{u}</td>
                            { currUser.role !== ROLES.ADMIN ? 
                                <td className='w-1/5'>{cellsUser.role}</td>
                            : currUser.role === ROLES.ADMIN && cellsUser.uuid === currUser.uuid ?
                                <td className='w-1/5'>{ROLES.ADMIN}</td>
                            : currUser.role === ROLES.ADMIN ?
                                <td className='w-2/5'>
                                    <div className='w-full flex justify-center'>
                                    <select onChange={(event) => handleVacationNumChange(event, cellsUser)} defaultValue={cellsUser.role} className="w-fit l-4 h-5 flex justify-center text-black items-center bg-gray-200">
                                        <option value={ROLES.HRMANAGER}>{ROLES.HRMANAGER}</option>
                                        <option value={ROLES.EMPLOYER}>{ROLES.EMPLOYER}</option>
                                    </select>
                                    </div>
                                </td>
                            : "ERR"
                            }
                            <td>
                                <UserVacateDays user={cellsUser}/>
                            </td>
                            {
                                (currUser.role === ROLES.ADMIN || currUser.role === ROLES.HRMANAGER) && currUser.uuid != cellsUser.uuid ? 
                                <td>
                                    <button onClick={() => {
                                        setShowFireConfirmWindow(true)
                                        setOnFireMember(cellsUser)
                                    }}>
                                        <FontAwesomeIcon icon={faUserMinus} className="text-xl" />
                                    </button>
                                </td>
                                : ""
                            }
                            
                        </tr>
                    })
                }
            </table>
            <RefreshWindow show={showRefreshConfirm} setShow={SetShowRefreshConfirm} />
            <ConfirmFireMemberWindow show={showFireConfirmWindow} setShow={setShowFireConfirmWindow} user={onFireMember} />
            </div>
        </React.Fragment>
    )
}
