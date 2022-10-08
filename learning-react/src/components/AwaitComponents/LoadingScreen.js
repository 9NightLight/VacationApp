import React from 'react'
import LoadScreenSVG from "../../images/Loading/LoadingSign.svg"
import { useSpring, animated } from 'react-spring';

export default function LoadingScreen({show}) {

    function Animation() {
        const styles = useSpring({
            loop: true,
            from: { rotateZ: 0},
            to: { rotateZ: 180},
        })
        
        return (
            <animated.div
              style={{
                width: 80,
                height: 80,
                ...styles,
              }}>
                <img src={LoadScreenSVG} />
            </animated.div>
        )
    }

    return (
        <div>
            {show ? 
                <div className='absolute w-full h-full top-0 left-0 bg-white z-40 flex justify-center items-center'>
                    {Animation()}
                </div>
                : ""
            }
        </div>
    )
}
