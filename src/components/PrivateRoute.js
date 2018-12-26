import { Route } from 'react-router-dom';
import React from 'react';
import { state } from '../models/state';

export const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route {...rest} render={(props) => (
        authenticated === true
            ? <Component {...props} />
            : window.location.href = state.configurations.SPARK_HOST
    )} />
);
