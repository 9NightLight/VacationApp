import React from "react";

export default function VacationDescription({setDescription}) {
    const handleChange = (event) => {
        setDescription(event.target.value)
    }

    return (
        <textarea onChange={handleChange} 
            className="max-w-80 max-h-16 w-80 h-16 bg-gray-200 border-2 border-gray-300" 
            placeholder="Description (Optional)">
            
        </textarea>
    )
}