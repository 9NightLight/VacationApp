import React from 'react'

export default function EventBox({event}) {


  return (
    <>
      {event.startDate.slice(4, 15) == new Date().toString().slice(4, 15) ? 
        <div className='relative w-full h-16 bg-blue-200 box-content rounded-xl mt-2 flex'>
          <div className='w-fit h-full flex-1 bg-green-400 flex justify-start items-center'>
            {event.type}
          </div>
          <div className='w-fit h-full flex-1 bg-white flex justify-start items-center'>
            {event.description}
          </div>
          <div className='w-fit h-full flex justify-between'>
            <div className='w-fit h-full flex-2 bg-purple-400 flex justify-start items-center'>
              {event.startDate.slice(4, 15)}
            </div>
            <div className='w-fit h-full flex-2 bg-yellow-400 flex justify-start items-center'>
            {event.endDate.slice(4, 15)}
            </div>
          </div>
        </div>
        :
        <div></div>}
    </>
  )
}
