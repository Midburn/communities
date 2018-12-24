import React from 'react';
import { withI18n } from 'react-i18next';

const BaseCampMembers = ({camp, t, onSave}) => {
    return (
        <div>
            Camp Members
        </div>
    )
};

export const CampMembers = withI18n()(BaseCampMembers);