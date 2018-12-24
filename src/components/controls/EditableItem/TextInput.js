import React from 'react';

export const TextInput = ({ title, value, onChange }) => {
    return (
        <div className="form-group">
            <label className="font-weight-bold"
                htmlFor="formGroupExampleInput">{ title }</label>
            <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                value={value}
                onChange={onChange}
            />
        </div>
    )
};
