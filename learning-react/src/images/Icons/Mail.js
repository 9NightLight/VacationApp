import React from 'react'

export default function Mail({_width, _height, _staticColor, _colorOnFocus=_staticColor, _isActive, _activeColor, _onClick}) {
    const [color, setColor] = React.useState(_staticColor)

    const onFocus = () => {
        setColor(c => c = _colorOnFocus)
    }

    const onBlur = () => {
        setColor(c => c = _staticColor)
    }

    React.useEffect(() => {
        const a = _isActive ? setColor(c => c = _activeColor) : setColor(c => c = _staticColor)
    }, [_isActive])

    return (
        <svg xmlns="http://www.w3.org/2000/svg" onClick={_onClick} width={_width} height={_height} viewBox="0 0 145 108.2">
            <g id="Mail" data-name="Mail" transform="translate(-94 -52.6)">
                <path id="Pfad_17" data-name="Pfad 17" d="M98.1,61l43.4,40.8L96.8,150.4A20.13,20.13,0,0,1,94,140.1V73.3A20.434,20.434,0,0,1,98.1,61Z" fill={color}/>
                <path id="Pfad_18" data-name="Pfad 18" d="M164.5,110.3l-59-55.5a20.878,20.878,0,0,1,9.3-2.2H218.3a20.8,20.8,0,0,1,7.1,1.3Z" fill={color}/>
                <path id="Pfad_19" data-name="Pfad 19" d="M167.7,120.3l13.4-12.4,47.2,50.3a20.247,20.247,0,0,1-10.1,2.6H114.8a20.562,20.562,0,0,1-11.9-3.8L148,108l13.2,12.4a4.6,4.6,0,0,0,3.3,1.3A5.15,5.15,0,0,0,167.7,120.3Z" fill={color}/>
                <path id="Pfad_20" data-name="Pfad 20" d="M239,73.3V140a20.95,20.95,0,0,1-4,12.2l-47.3-50.4,45.8-42.5A20.814,20.814,0,0,1,239,73.3Z" fill={color}/>
            </g>
            
        </svg>
    )
}

