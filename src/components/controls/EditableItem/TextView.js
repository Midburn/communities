import React from 'react';

export const TextView = ({ title, value }) => {
    return (
        <div className="TextView">
            <h6 className="h5-responsive">{title}</h6>
            <p>{value}</p>
        </div>
    )
};
