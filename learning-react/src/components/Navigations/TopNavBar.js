import React from "react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import my_photo_1 from "../../my_photo_1.png";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { CalendarContext } from "../../Home";
import AddMember from "./AddMember";
import { ROLES } from "../SignIn";

const handleSignOut = () => {
    signOut(auth).catch(err => console.log(err))
}

function TopNavBar() {
    const { currUser } = React.useContext(CalendarContext)
    const [ showAddMember, setShowAddMember] = React.useState(false);
    // const [ letter, setLetter ] = React.useState("")

    const generateColor = () => 
    {
        const col = Math.floor(Math.random() * 4);
    }
    // console.log(col)
    // React.useEffect(() => {
    //     let a = currUser.firstName;
    //     let res = String(a)
    //     setLetter(res[0])
    // }, [currUser])

    return (
        <div className="w-full h-12 border-b-2">
            <div className="relative w-max--75 h-full left-12 flex justify-between items-center ">
                    <div className="min-w-fit">
                        Hello, <div className="font-bold inline-block">{currUser.firstName}!</div>
                    </div>
                    <div className="w-72 max-w-lg min-w-fit h-full flex items-center justify-between">
                        {currUser.role === ROLES.EMPLOYER
                            ? <div className="w-18 mr-6"></div> : currUser.role === ROLES.HRMANAGER 
                            ? <div className="mr-6 p-1 rounded-md bg-blue-600 text-white cursor-pointer" onClick={() => setShowAddMember(true)}>Add member</div>
                            : <div></div>
                        }
                        <div className="mr-6">Left: {currUser.vacationsNum} {currUser.vacationsNum !== 1 ? "days" : "day"}</div>
                        <div className="mr-6 w-8 h-8 flex justify-center items-center rounded-full text-white bg-orange-400">{String(currUser.firstName)[0]}</div>
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