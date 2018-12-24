import React from 'react';

export const TextAreaInput = ({ title, value, onChange }) => {
    return (
        <div className="form-group">
            <label className="font-weight-bold"
                htmlFor="formGroupExampleInput">{ title }</label>
            <textarea
                className="form-control"
                id="formGroupExampleInput"
                value={value}
                rows="3"
                style={{resize: 'none'}}
                onChange={onChange}
            />
        </div>
    )
};
