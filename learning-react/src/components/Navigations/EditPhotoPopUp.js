import React from 'react'
import { CalendarContext } from '../../Home';
import CropEasy from './Crop/CropEasy';

export const FILE_EXTENSIONS = {
    JPG: "image/jpg",
    JPEG: "image/jpeg",
    PNG: "image/png",
  }

export default function EditPhotoPopUp({show, setShow}) {
    const [showError, setShowError] = React.useState(false)
    const [file, setFile] = React.useState(null) 
    const [photoURL, setPhotoURL] = React.useState(null) 
    const [openCrop, setOpenCrop] = React.useState(false) 

    const handleChange = e => {
        const file = e.target.files[0]
        if(file)
        {
            if(file.type === FILE_EXTENSIONS.JPEG || file.type === FILE_EXTENSIONS.JPG || file.type === FILE_EXTENSIONS.PNG)
            {
                setShowError(false)
                setFile(file)
                setPhotoURL(URL.createObjectURL(file))
                setOpenCrop(true)
            }
            else setShowError(true)
        }
    }

    return (
        <div>
            {   show ?
                <div className='absolute w-full h-full left-0 top-0 z-10 flex justify-center items-center'>
                    <div className='w-120 h-120 bg-white z-20 rounded-xl'>
                        <div className='w-full h-full flex flex-col justify-center items-center'>
                            {openCrop ? 
                            <CropEasy {...{photoURL, setPhotoURL, setOpenCrop, setShow}}/>
                            : <div className='w-full h-full flex flex-col justify-center items-center'>
                            <input type="file" accept='.png, .jpg, .jpeg' onChange={handleChange}/>
                            <div className={showError === false? 'hidden' : 'w-full text-center text-sm text-red-500'}>Image must be JPG, JPEG or PNG</div>
                            </div>}
                        </div>
                    </div>
                    <div onClick={() => {setShow(false); setShowError(false)}} className='absolute w-full h-full left-0 top-0 z-10 bg-gray-700/50'></div>
                </div>
                : 
                <div></div>
            }
        </div>
    )
}
