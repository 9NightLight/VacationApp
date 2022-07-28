import React from "react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import my_photo_1 from "../../my_photo_1.png";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { CalendarContext } from "../../Home";
import AddMember from "./AddMember";

const handleSignOut = () => {
    signOut(auth).catch(err => console.log(err))
}

function TopNavBar() {
    const { currUser } = React.useContext(CalendarContext)
    const [ showAddMember, setShowAddMember] = React.useState(false);

    return (
        <div className="w-full h-12 border-b-2">
            <div className="relative w-max--75 h-full left-12 flex justify-between items-center ">
                    <div className="min-w-fit">
                        Hello, {currUser.firstName}!
                    </div>
                    <div className="w-72 max-w-lg min-w-fit h-full flex items-center justify-between">
                        <div className="mr-6 p-1 rounded-md bg-blue-600 text-white cursor-pointer" onClick={() => setShowAddMember(true)}>Add member</div>
                        <div className="mr-6">Left: {currUser.vacationsNum} {currUser.vacationsNum !== 1 ? "days" : "day"}</div>
                        <div className="mr-6"><img src={my_photo_1} alt="" className="w-8 h-8 rounded-full"></img></div>
                        <FontAwesomeIcon onClick={handleSignOut} icon={faArrowRightFromBracket} className="mr-6 cursor-pointer"/>
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