import React from 'react';
import { ListGroupItem, Badge } from 'mdbreact';
import './ListItemWithBadge.scss';
import { withI18n } from 'react-i18next';

const BaseListItemWithBadge = ({ title, color, value, t }) => {
    return (
        <ListGroupItem className="ListItemWithBadge">
            <span className="ListItemTitle">{title}</span>
            <Badge color={color || "light"}
                      className="ListItemValue"
                      pill>{value || t('N/A')}</Badge>
        </ListGroupItem>
    );
};

export const ListItemWithBadge = withI18n()(BaseListItemWithBadge)