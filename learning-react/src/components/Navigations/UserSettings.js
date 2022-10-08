import React from 'react';
import { CalendarContext } from '../../Home';
import PersonPNG from "../../images/PersonPNG.png";
import { faPencil, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditPhotoPopUp from './EditPhotoPopUp';

export default function UserSettings() {
  const {currUser, currUserPhoto} = React.useContext(CalendarContext)
  const [onEdit, setOnEdit] = React.useState(false)
  const firstNameRef = React.useRef()
  const lastNameRef = React.useRef()
  const [showEditPhoto, setShowEditPhoto] = React.useState(false)


  const onSubmit = e => {

  }

  return (
    <div className='w-120 flex'>
      <div className='flex-1 h-full'>
      <EditPhotoPopUp show={showEditPhoto} setShow={setShowEditPhoto}/>
        <div className='relative w-full h-56 flex justify-center'>
          <button onClick={() => setShowEditPhoto(true)} className={currUserPhoto === null ? 'relative w-56 h-full bg-orange-400 text-white flex justify-center items-center rounded-full hover:bg-gray-500/10 hover:text-gray-400 active:shadow-xl active:bg-gray-500/30'
                                                                    :'relative w-56 h-full flex justify-center items-center rounded-full hover:bg-gray-500/10 hover:text-gray-400 active:shadow-xl active:bg-gray-500/30'} title='Change profile image'>
              {
                currUserPhoto !== null ? <img className='w-4/5 h-4/5 sm:w-full sm:h-full rounded-full hover:opacity-50' src={currUserPhoto} alt={String(currUser.firstName)[0]}></img>
                :
                <div className='text-9xl'>{String(currUser.firstName)[0]}</div>
              }
          </button>
        </div>
        <div className='sm:w-full h-96 flex justify-center'>
          <div className='w-4/5 h-5/6 bg-main-gray rounded-xl pl-4 mt-6'>
              <form onSubmit={onSubmit} className='font-bold text-2xl w-full h-16 pr-4 mb-2 mt-3 flex justify-between items-center'>
                <img src={PersonPNG} className="w-12 h-12" alt=''></img>
                {/* <button type={onEdit === false ? "submit" : "button"} 
                        // onClick={() => setOnEdit(!onEdit)} 
                        className='bg-white w-10 h-10 flex justify-center items-center rounded-full'>
                          {onEdit ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faPencil} />}</button> */}
              </form>
              <div className='w-5/6 h-10 mb-2 flex flex-col justify-center'>
                <div className='text-gray-light text-base'>First name</div>
                { onEdit ? 
                  <input type="text" className='text-white font-bold bg-main-gray enabled:hover:border-gray-400 border-2 opacity-100' ref={firstNameRef} placeholder={currUser.firstName + " (edit)"}></input>
                  :
                  <div className='text-white font-bold'>{currUser.firstName}</div>
                }
              </div>
              <div className='w-5/6 h-10 mb-2 flex flex-col justify-center'>
                <div className='text-gray-light text-base'>Last name</div>
                { onEdit ? 
                  <input type="text" className='text-white font-bold bg-main-gray  enabled:hover:border-gray-400 border-2 opacity-100' ref={lastNameRef} placeholder={currUser.lastName + " (edit)"}></input>
                  :
                  <div className='text-white font-bold'>{currUser.lastName}</div>
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
