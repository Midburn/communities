import React from 'react';

/**
 *
 * @param options - { value: string; displayName: string; }
 * @returns {*}
 * @constructor
 */
export const OptionsInput = ({ title, value, onChange, options }) => {
    return (
        <div className="form-group">
            <label className="font-weight-bold"
                   htmlFor="formGroupExampleInput">{ title }</label>
            <select onChange={onChange} className="browser-default custom-select">
                {options.map(option => {
                    return (
                        <option selected={value === option.value} value={option.value}>{option.displayName}</option>
                    )
                })}
            </select>
        </div>
    )
};
