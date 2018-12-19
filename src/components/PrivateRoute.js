import { Route } from 'react-router-dom';
import React from 'react';

export const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route {...rest} render={(props) => (
        authenticated === true
            ? <Component {...props} />
            : window.location.href = 'http://localhost:3000'
    )} />
);
