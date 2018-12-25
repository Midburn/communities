import React from 'react';
import './CheckboxInput.scss';
import i18n from '../../../services/i18n';
/**
 *
 * @param options - { value: string; displayName: string; }
 * @returns {*}
 * @constructor
 */
export const CheckboxInput = ({ title, value, onChange }) => {
    return (
        <div className="form-group d-flex justify-content-start align-content-center">
            <div className={`checkbox-container ${i18n.language === 'he' ? 'rtl' : null}`}>
                <input onChange={onChange}  checked={value} type="checkbox" id={`${title}-checkbox`} />
            </div>
            <label className="font-weight-bold"
                   htmlFor="formGroupExampleInput">{ title }</label>
        </div>
    )
};
