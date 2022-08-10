import React from 'react'
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from '../../firebase';
import { CalendarContext } from '../../Home';

export const FILE_EXTENSIONS = {
    JPG: "image/jpg",
    JPEG: "image/jpeg",
    PNG: "image/png",
  }

export default function EditPhotoPopUp({show, setShow}) {
    const [photoOnEdit, setPhotoOnEdit] = React.useState(null)
    const [showError, setShowError] = React.useState(false)
    const { currUser, setCurrUserPhoto} = React.useContext(CalendarContext) 

    const onSave = () => {
        if (photoOnEdit === null) return;
        if(photoOnEdit.type === FILE_EXTENSIONS.JPEG || photoOnEdit.type === FILE_EXTENSIONS.JPG || photoOnEdit.type === FILE_EXTENSIONS.PNG)
        {
            const imageRef = ref(storage, `${currUser.uuid}`);
            uploadBytes(imageRef, photoOnEdit).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setCurrUserPhoto(url);
            })
            .then(
                setShow(false), 
                setShowError(false)
            )
            
        });
        }
        else setShowError(true)
    }

    return (
        <div>
            {   show ?
                <div className='absolute w-full h-full left-0 top-0 z-10 flex justify-center items-center'>
                    <div className='w-96 h-72 bg-white z-20 rounded-xl'>
                        <div className='w-full h-full flex flex-col justify-center items-center'>
                            <input type="file" accept='.png, .jpg, .jpeg' onChange={(event) => {
                                                            setPhotoOnEdit(event.target.files[0]);
                                                        }}/>
                            <button onClick={onSave} className='w-32 h-16 bg-blue-500 rounded-xl text-white mt-2'>Save</button>
                            <div className={showError === false? 'hidden' : 'w-full text-center text-sm text-red-500'}>Image must be JPG, JPEG or PNG</div>
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
