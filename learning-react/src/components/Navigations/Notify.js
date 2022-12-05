import React from 'react';
import { CalendarContext } from '../../Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { onValue, ref, remove, set, update } from 'firebase/database';
import { auth, db } from '../../firebase';
import { ROLES } from '../SignIn';
import { useNavigate } from 'react-router-dom';
import { calcSubscription } from '../StripeComponents/StripeCustomFunctions';

export default function Notify({uuid, setInvites, invites}) {
  const { users, currUser } = React.useContext(CalendarContext)
  const [ owner, setOwner ] = React.useState([])
  const [ ownerDefaultVacateDays, setOwnerDefaultVacateDays ] = React.useState(0)
  const [show, setShow] = React.useState(false)
  const [cancelOption, setCancelOption] = React.useState(false)
  const nav = useNavigate()

  React.useEffect(() => {
    setOwner(users.find((val) => { return val.uuid === uuid }))
  }, [])

  React.useEffect(() => {
    onValue(ref(db, `rooms/${owner.room}/settings/`), (snapshot) => {
      const data = snapshot.val()
      if(data !== null)
      {
        setOwnerDefaultVacateDays(data.defaultNumVacations)
      }
    })
  }, [owner])

  const handleAccept = (e) => {
    auth.onAuthStateChanged(user => {
      if (user && currUser !== undefined && owner)
      {
        if(currUser.uuid !== owner.uuid) {
          calcSubscription(currUser, true)
        }
        else if(currUser.uuid === owner.uuid) {
          // Attempt to create distribution every user on lead leave

          // onValue(ref(db, `rooms/${currUser.room}/settings/country`), (snapshot) => {
          //   const countryObject = snapshot.val() // .attr, .country
            
            

          //   onValue(ref(db, `rooms/${currUser.room}/members`), (snapshot) => {
          //     const users = snapshot.val()
  
          //     Object.values(users).map(user => {
          //       set(ref(db, `/users/${user.uuid}`), {
          //         firstName: user.firstName,
          //         lastName: user.lastName,
          //         vacationsNum: 10,
          //         unpaidVacationDays: 0,
          //         sickLeaves: 0,
          //         role: ROLES.ADMIN,
          //         email: user.email,
          //         room: user.uuid,
          //         uuid: user.uuid,
          //       })
          //       .then(set(ref(db, `/rooms/${uuid}/members/${uuid}`), { firstName: user.firstName,
          //                                                               lastName: user.lastName,
          //                                                               vacationsNum: 10,
          //                                                               unpaidVacationDays: 0,
          //                                                               sickLeaves: 0,
          //                                                               role: ROLES.ADMIN,
          //                                                               email: user.email,
          //                                                               uuid: user.uuid,
          //       }))
          //       .then(set(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10}))
          //       .then(set(ref(db, `rooms/${uuid}/settings/country`), {
          //                                                               attr: countryObject.attr,
          //                                                               country: countryObject.country
          //       }))
          //     })
          //   })

          //   calcSubscription(currUser, false, true)
          // })
          
          // onValue(ref(db, `rooms/${currUser.room}/members`), (snapshot) => {
          //   const data = snapshot.val()

          //   Object.values(data).map(user => {
          //     console.log(user.firstName)
          //   })

          //   set(ref(db, `/users/${user.uuid}`), {
          //     firstName: user.firstName,
          //     lastName: user.lastName,
          //     vacationsNum: 10,
          //     unpaidVacationDays: 0,
          //     sickLeaves: 0,
          //     role: ROLES.ADMIN,
          //     email: user.email,
          //     room: user.uuid,
          //     uuid: user.uuid,
          //   })
          //   .then(set(ref(db, `/rooms/${uuid}/members/${uuid}`), { firstName: user.firstName,
          //                                                           lastName: user.lastName,
          //                                                           vacationsNum: 10,
          //                                                           unpaidVacationDays: 0,
          //                                                           sickLeaves: 0,
          //                                                           role: ROLES.ADMIN,
          //                                                           email: user.email,
          //                                                           uuid: user.uuid,
          //   }))
          //   .then(set(ref(db, `rooms/${uuid}/settings`), {defaultNumVacations: 10}))
          //   .then(set(ref(db, `rooms/${uuid}/settings/country`), {
          //                                                           attr: a.attr,
          //                                                           country: a.country
          //   }))
          // })

          // mark old room as non-active

          set(ref(db, `rooms/${currUser.uuid}/settings`), { isRoomActive: false })

          // canceling subscription
          calcSubscription(currUser, true, true)
        } 
        else {
          console.log("Can't find user!")
        }

        update(ref(db, `/users/${currUser.uuid}`), { room: owner.uuid, role: ROLES.EMPLOYER, vacationsNum: ownerDefaultVacateDays }) // Here problem with reupdating

          if(currUser.room === currUser.uuid)
          {
            // remove user from current room if that exist
            // remove(ref(db, `/rooms/${currUser.uuid}`))

            // mark old room as non-active
            set(ref(db, `rooms/${currUser.uuid}/settings`), { isRoomActive: false })
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
                                                                          vacationsNum: ownerDefaultVacateDays,
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
    <React.Fragment>
      <div className='sm:w-120 w-80 h-8 flex justify-between items-center mb-1'>
          <div className='flex'>
            <div className='font-bold'>{ owner.lastName + ", " + owner.firstName }</div>
            <div className='ml-2'> invites you!</div>
          </div>
          <div className='w-18 flex justify-between'>
              <button onClick={() => setShow(true)}>
                <FontAwesomeIcon className='text-3xl text-green-apple' icon={faCircleCheck} />
              </button>
              <button onClick={() => {
                setShow(true)
                setCancelOption(true)
              }}>
                <FontAwesomeIcon className='text-3xl text-red-500' icon={faCircleXmark} />
              </button>
          </div>
      </div>

      {/* Confirmation window */}
      {show ? 
      <div className='absolute w-full h-full left-0 top-0 flex justify-center items-center'>
        <div className=' w-192 h-80 z-50 bg-white text-black rounded-xl flex flex-col items-center justify-between'>
          <div className=' text-3xl mt-10 font-semibold'>Do you want to {cancelOption ? "refuse the invitation" : "accept the invitation"} to another group?</div>
            <div className='w-full flex justify-around mb-4'>
                <button onClick={() => setShow(false)} className='w-2/5 h-16 font-semibold  rounded-xl border-gray-500 border active:shadow-lg active:shadow-gray-400'>Cancel</button>
                <button onClick={() => {
                  return cancelOption ? handleReject() : !cancelOption ? handleAccept() : ""
                }} className='w-2/5 h-16 font-semibold bg-red-500 rounded-xl text-white active:shadow-lg active:shadow-blue-400'>Confirm</button>
            </div>
          </div>
        <div onClick={() => {
          setShow(false)
          setCancelOption(false)
        }} className='absolute z-20 w-full h-full left-0 top-0 bg-gray-700/50' />        
      </div>
      : ""
      }
    </React.Fragment>
  )
}
