import React from 'react';
import { withI18n } from 'react-i18next';

const BaseCampSuppliers = ({camp, t, onSave}) => {
    return (
        <div>
            Camp Suppliers
        </div>
    )
};

export const CampSuppliers = withI18n()(BaseCampSuppliers);