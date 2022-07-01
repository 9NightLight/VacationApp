import React from "react";
import { useTransition, animated } from 'react-spring';

export default function TransitionComponent({content, show, _duration = 100}) {
    function Animation() {
        const transitions = useTransition(show, {
        from: { opacity: 1 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: _duration },
        })

        return transitions(
        (styles, item) => item && <animated.div style={styles}>
            {content}
        </animated.div>
        )
    }

    return (
        <React.Fragment>
            {Animation()}
        </React.Fragment>
    )
}