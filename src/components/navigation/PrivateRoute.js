import { Route } from 'react-router-dom';
import React from 'react';
import { PermissionService } from '../../services/permissions';
import { state } from '../../models/state';

export const PrivateRoute = ({component: Component, permit, authenticated, ...rest}) => {
    const permissionService = new PermissionService();
    if (state.authenticated === true && (permit === true || permit === undefined)) {
        return <Route {...rest} render={(props) => (
            <Component {...props} />
        )}/>
    }
    permissionService.redirectToSpark();
    return (<div></div>);
};
