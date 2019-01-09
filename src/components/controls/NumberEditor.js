import React from 'react';
import style from './NumberEditor.scss';
import {TiPlus, TiMinus} from 'react-icons/ti'

export const NumberEditor = ({value, onChange, min, max}) => {
    return (
        <div className={style.NumberCounter}>
            <span disabled={max !== 'undefined' && value >= max} onClick={() => onChange(Number(value) + 1)} id="increment" className="handle">
                <TiPlus />
            </span>
            <input type="number" value={value || 0} onChange={(e) => onChange(Number(e.target.value))}/>
            <span disabled={max !== 'undefined' && value <= min} onClick={() => onChange(Number(value) - 1)} id="decrement" className="handle">
                <TiMinus />
            </span>
        </div>
    );
};