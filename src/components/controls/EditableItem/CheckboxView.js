import React from 'react';
import { Icon } from 'mdbreact';

export const CheckboxView = ({ title, value }) => {
    return (
        <div className="TextView">
            { value ?  <Icon icon="check" color="success" /> : <Icon icon="times" color="danger" />}
            <h6 className="h5-responsive">{title}</h6>
        </div>
    )
};
