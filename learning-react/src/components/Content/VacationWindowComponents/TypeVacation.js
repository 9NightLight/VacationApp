import React from "react";

export default function TypeVacation({setType}) {

    return (
        <React.Fragment>
            <div>
                <p className="text-base font-bold">Choose type vacation</p>
                <select onChange={(event) => setType(event.target.value)} defaultValue={"Unpayed"} className="w-80 h-8 flex justify-center items-center bg-gray-200">
                    <option value="Vacation">Vacation</option>
                    <option value="Unpayed" >Unpayed</option>
                    <option value="Sick leave">Sick leave</option>
                </select>
            </div>
        </React.Fragment>
    )
}