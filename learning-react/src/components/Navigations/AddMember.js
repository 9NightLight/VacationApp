import React from 'react';

export default function AddMember({setShow}) {
    const EmailRef = React.useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(EmailRef.current.value);
        EmailRef.current.value = "";
    }

    return (
        <React.Fragment>
                <div className='absolute left-0 top-0 w-full h-full bg-blue-50 z-10 flex justify-center items-center'>
                    <div className="relative z-50 w-96 h-72 bg-white flex flex-col justify-between rounded-xl shadow-xl">
                        <form onSubmit={handleSubmit}>
                            <div className='font-bold text-2xl ml-4'>Add member</div>
                            <div className='absolute flex flex-col justify-around items-center h-5/6 w-full'>
                                <input className='w-5/6 h-10 border-2' type="email" ref={EmailRef} placeholder="example@example.com"></input>
                                <button type='submit' className='w-1/2 h-fit p-4 bg-blue-300'>Add member</button>
                            </div>
                        </form>
                    </div>
                    <div className='z-20 w-full h-full absolute top-0 left-0' onClick={()=>setShow(false)}></div>
                </div>
                
        </React.Fragment>      
    )
}
