import React from "react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from "../../../firebase/firebase";
import { signOut } from "firebase/auth";
import { CalendarContext } from "../../../Home";
import AddMember from "./Components/AddMember";
import { ROLES } from "../../Registation/SignIn";
import {
ref,
getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../firebase/firebase";

function TopNavBar() {
    const { currUser, currUserPhoto, setCurrUserPhoto } = React.useContext(CalendarContext)
    const [ showAddMember, setShowAddMember] = React.useState(false);

    React.useEffect(() => {
        if(currUser.uuid !== undefined)
        {
            getDownloadURL(ref(storage, `${currUser.uuid}`))
            .then((url) => { 
                setCurrUserPhoto(url)
            })
            .catch(res => console.log("Profile image not defined"))
        }
    }, [currUser]);

    const generateColor = () => 
    {
        const col = Math.floor(Math.random() * 4);
    }

    const handleSignOut = () => {
        signOut(auth)
        .then()
        .catch(err => console.log(err))
    }

    return (
        <div className="w-full h-12 border-b-2 text-sm sm:text-base bg-white">
            <div className="relative w-max--75 h-full left-0 sm:left-12 flex justify-between items-center ">
                    <div className="min-w-fit">
                        Hello, <div className="font-bold inline-block">{currUser.firstName}!</div>
                    </div>
                    <div className="w-72 max-w-lg min-w-fit h-full flex items-center justify-between">
                        {currUser.role === ROLES.EMPLOYER ?
                            <div className="w-18 lg:mr-6"></div> 
                        : currUser.role === ROLES.HRMANAGER || currUser.role === ROLES.ADMIN ?
                            <div className="w-24 min-w-fit flex justify-center items-center h-7 mr-6 p-1 rounded-md bg-blue-600 text-white cursor-pointer" onClick={() => setShowAddMember(true)}>Add member</div>
                        : <div></div>
                        }
                        <div className="lg:mr-6 md:mr-6 sm:mr-6 w-24 min-w-fit">Left: {currUser.vacationsNum} {currUser.vacationsNum !== 1 ? "days" : "day"}</div>
                        { currUserPhoto !== null ? 
                            <img className="mr-6 w-8 h-8 rounded-full" src={currUserPhoto} />
                        :
                            <div className="mr-6 w-8 h-8 flex justify-center items-center rounded-full text-white bg-orange-400">{String(currUser.firstName)[0]}</div>
                        }
                        <FontAwesomeIcon onClick={handleSignOut} icon={faArrowRightFromBracket} className="sm:mr-6 mr-0 cursor-pointer"/>
                    </div>
            </div>
            {
                showAddMember === false ?
                <div></div>
                : showAddMember === true ?
                <AddMember setShow={setShowAddMember}/>
                : 
                <div></div>
            }
        </div>
    )
}

export default TopNavBar;