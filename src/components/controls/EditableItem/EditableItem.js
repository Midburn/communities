import React from 'react';
import { TextInput } from './TextInput';
import { TextView } from 'src/components/controls/EditableItem/TextView';

export const EditableItem = ({title, value, type, editMode, onChange }) => {

    function renderView(type) {
        switch (type) {
            case 'text':
            default:
                return <TextView value={value} title={title}/>
        }
    }

    function renderInput(type) {
        switch (type) {
            case 'text':
            default:
                return <TextInput value={value} title={title} onChange={onChange}>;

        }
    }

    return (
        <div>
            {editMode ? renderInput(type) : renderView(type)}
        </div>
    )
};