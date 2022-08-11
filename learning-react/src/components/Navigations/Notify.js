import React from 'react';
import { CalendarContext } from '../../Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { onValue, ref, remove, set, update } from 'firebase/database';
import { auth, db } from '../../firebase';
import { ROLES } from '../SignIn';
import { useNavigate } from 'react-router-dom';

export default function Notify({uuid, setInvites, invites}) {
  const { users, currUser } = React.useContext(CalendarContext)
  const [ owner, setOwner ] = React.useState([])
  const nav = useNavigate()

  React.useEffect(() => {
    setOwner(users.find((val) => { return val.uuid === uuid }))
  }, [])

  const handleAccept = (e) => {
    e.preventDefault()
    auth.onAuthStateChanged(user => {
      if (user && currUser !== undefined)
      {
        update(ref(db, `/users/${currUser.uuid}`), { room: owner.uuid, role: ROLES.EMPLOYER, vacationsNum: owner.defaultVacationsNum }) // Here problem with reupdating

        if(currUser.room === currUser.uuid)
        {
          // remove user from current room if that exist
          remove(ref(db, `/rooms/${currUser.uuid}`))
        }
        else if(currUser.room !== currUser.uuid)
        {
          remove(ref(db, `/rooms/${currUser.room}/members/${currUser.uuid}`))
        }

        // remove user from pending requests
        onValue(ref(db, `/rooms/${owner.uuid}/pending/`), (snapshot) => {
          const data = snapshot.val()
          if(data !== null)
          {
            Object.values(data).map((val, i) => val.map((v, idx) => {
              if(v === currUser.email)
              {
                remove(ref(db, `/rooms/${owner.uuid}/pending/emailArray/${idx}`))
              }
            }))
          }
        })

        onValue(ref(db, `/rooms/${owner.uuid}/pending/emailArray`), (snapshot) => {
          let arr = new Array()
          const data = snapshot.val();
          if(data !== null)
          {
            Object.values(data).map((val) => {
              if(val === currUser.email)
              {
                arr = [...arr, owner.uuid]
              }
            })
            setInvites(arr);
          }
        })

        // Adding new member to owner room 
        set(ref(db, `/rooms/${owner.uuid}/members/${currUser.uuid}/`), { firstName: currUser.lastName,
                                                                        lastName: currUser.firstName,
                                                                        vacationsNum: owner.defaultVacationsNum,
                                                                        role: ROLES.EMPLOYER,
                                                                        email: currUser.email,
                                                                        uuid: currUser.uuid, })

        // remove(ref(db, `/rooms/${currUser.uuid}`))

        auth.onAuthStateChanged(user => {
          if(user)
          {
            nav("/auth");
          }
        })
      }
    })
  }

  const handleReject = (e) => {
    e.preventDefault()
    auth.onAuthStateChanged(user => {
      if(user)
      {
        onValue(ref(db, `/rooms/${owner.uuid}/pending/`), (snapshot) => {
          const data = snapshot.val()
          if(data !== null)
          {
            Object.values(data).map((val, i) => val.map((v, idx) => {
              if(v === currUser.email)
              {
                remove(ref(db, `/rooms/${owner.uuid}/pending/emailArray/${idx}`))
              }
              let a = new Array()
              invites.map((val, idx) => { 
                if(val !== owner.room) {a = [...a, val]}
              })
              setInvites(a)
            }))
          }
        })
      }
    })
  }

  return (
    <div className='w-96 h-8 flex justify-between items-center mb-1'>
        <div className='flex'>
          <div className='font-bold'>{ owner.lastName + ", " + owner.firstName }</div>
          <div className='ml-2'> invites you!</div>
        </div>
        <div className='w-18 flex justify-between'>
          <form onSubmit={handleAccept}>
            <button type='submit'>
              <FontAwesomeIcon className='text-3xl text-green-apple' icon={faCircleCheck} />
            </button>
          </form>
          <form onSubmit={handleReject}>
            <button type='submit'>
              <FontAwesomeIcon className='text-3xl text-red-500' icon={faCircleXmark} />
            </button>
          </form>
        </div>
    </div>
  )
}
