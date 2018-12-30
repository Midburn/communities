import React from 'react';
import { withI18n } from 'react-i18next';

const BaseCampFiles = ({camp, t, onSave}) => {
    return (
        <div>
            Camp Files
        </div>
    )
};

export const CampFiles = withI18n()(BaseCampFiles);