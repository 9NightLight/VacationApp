import React from 'react';
import { CalendarContext } from '../../Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons"

export default function Notify({uuid}) {
  const { users, currUser } = React.useContext(CalendarContext)
  const [ owner, setOwner ] = React.useState([])

  React.useEffect(() => {
    setOwner(users.find((val) => { return val.uuid === uuid }))
  }, [])

  const handleAccept = () => {
    console.log("I handle accept from: ", currUser, " to connect to room: ", owner)
  }

  const handleReject = () => {
    console.log("I handle reject from: ", currUser, " on invite: ", owner)
  }

  return (
    <div className='w-96 h-8 flex justify-between items-center mb-1'>
        <div className='flex'>
          <div className='font-bold'>{ owner.lastName + ", " + owner.firstName }</div>
          <div className='ml-2'> invites you!</div>
        </div>
        <div className='w-18 flex justify-between'>
          <FontAwesomeIcon onClick={handleAccept} className='text-3xl text-green-apple' icon={faCircleCheck} />
          <FontAwesomeIcon onClick={handleReject} className='text-3xl text-red-500' icon={faCircleXmark} />
        </div>
    </div>
  )
}
