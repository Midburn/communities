import React from 'react';
import './IconInput.scss';

export const IconInput = ({icon, placeholder, onChange}) => {
    if (!icon) {
        throw new Error('Must specify icon when using IconComponent')
    }
    return (
        <div className="IconInput">
            {icon}
            <input placeholder={placeholder} onChange={onChange}/>
        </div>
    )
};
