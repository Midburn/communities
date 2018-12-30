import { Route } from 'react-router-dom';
import React from 'react';
import { state } from '../../models/state';

export const PrivateRoute = ({ component: Component, authenticated, permit, ...rest }) => (
    <Route {...rest} render={(props) => (
        authenticated === true && (permit === true || permit === undefined)
            ? <Component {...props} />
            : window.location.href = state.configurations.SPARK_HOST ||
            process.env.NODE_ENV === 'production' ? 'https://spark.midburn.org' : 'http://localhost:3000'
    )} />
);
