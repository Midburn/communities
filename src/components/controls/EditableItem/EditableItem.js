import React from 'react';
import { TextInput } from './TextInput';
import { TextView } from './TextView';
import { TextAreaInput } from './TextAreaInput';
import { OptionsInput } from './OptionsInput';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxView } from './CheckboxView';

export const EditableItem = ({title, value, type, editMode, onChange, options }) => {

    function renderView(type) {
        // Render view items (currently only label and value)
        switch (type) {
            case 'checkbox':
                return <CheckboxView value={value} title={title} />;
            case 'text':
            case 'options':
            case 'textarea':
            default:
                return <TextView value={value} title={title}/>;
        }
    }

    function renderInput(type) {
        // Render input items based on type
        switch (type) {
            case 'checkbox':
                if (typeof value !== 'boolean' && ![0 , 1].includes(value)) {
                    throw new Error(`Value passed to checkbox item titled ${title} must be of boolean type`);
                }
                return <CheckboxInput value={value} title={title} onChange={onChange} />;
            case 'options':
                if (!options) {
                    throw new Error(`Options input titled ${title} must receive options property!`);
                }
                return <OptionsInput value={value} title={title} onChange={onChange} options={options} />;
            case 'textarea':
                value = value || '';
                return <TextAreaInput value={value} title={title} onChange={onChange} />;
            case 'text':
            default:
                value = value || '';
                return <TextInput value={value} title={title} onChange={onChange} />;
        }
    }

    return (
        <div>
            {editMode ? renderInput(type) : renderView(type)}
        </div>
    )
};