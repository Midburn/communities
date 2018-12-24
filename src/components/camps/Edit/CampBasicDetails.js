import React from 'react';
import { withI18n } from 'react-i18next';

const BaseCampDetailsEdit = ({camp, t, onSave}) => {
    return (
        <div>
            Camp Details
        </div>
    )
};

export const CampBasicDetails = withI18n()(BaseCampDetailsEdit);