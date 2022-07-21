import React from "react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import my_photo_1 from "../../my_photo_1.png";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { onValue, ref } from 'firebase/database';


class User {
    constructor(){
        this.UserName = "Maksym";
        this.LeftDays = 5;
    }
}

const handleSignOut = () => {
    signOut(auth).catch(err => console.log(err))
}

function TopNavBar() {
    const curr = new User();
    const [UserName, setUserName] = React.useState("");

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            onValue(ref(db, `/users`), (snapshot) => {
                setUserName("");
                const data = snapshot.val();
                Object.values(data).find((_user) => {
                    if(user.uid !== _user.uuid) {

                    }
                    else if (user.uid === _user.uuid) {
                        setUserName(_user.name)
                    }
                });
            });
          } 
          else if (!user) {

          }
        });
    }, []);

    return (
        <div className="w-full h-12 border-b-2">
            <div className="relative w-max--75 h-full left-12 flex justify-between items-center ">
                    <div className="min-w-fit">
                        Hello, {UserName}!
                    </div>
                    <div className="w-56 max-w-lg min-w-fit h-full flex items-center justify-between">
                        <div className="mr-6">Left: {curr.LeftDays} day(s)</div>
                        <div className="mr-6"><img src={my_photo_1} className="w-8 h-8 rounded-full"></img></div>
                        <FontAwesomeIcon onClick={handleSignOut} icon={faArrowRightFromBracket} className="mr-6"/>
                    </div>
            </div>
        </div>
    )
}

export default TopNavBar;