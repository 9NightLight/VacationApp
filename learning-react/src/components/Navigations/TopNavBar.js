import { isCursorAtEnd } from "@testing-library/user-event/dist/utils";
import React from "react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import my_photo_1 from "../../my_photo_1.png"

class User {
    constructor(){
        this.UserName = "Maksym";
        this.LeftDays = 5;
    }
}

function TopNavBar() {
    const curr = new User();
    return (
        <div className="w-full h-12 border-b-2">
            <div className="relative w-max--75 h-full left-12 flex justify-between items-center ">
                    <div className="min-w-fit">
                        Hello, {curr.UserName}!
                    </div>
                    <div className="w-56 max-w-lg min-w-fit h-full flex items-center justify-between">
                        <div className="mr-6">Left: {curr.LeftDays} day(s)</div>
                        <div className="mr-6"><img src={my_photo_1} className="w-8 h-8 rounded-full"></img></div>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-6"/>
                    </div>
            </div>
        </div>
    )
}

export default TopNavBar;