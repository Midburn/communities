import { Route } from 'react-router-dom';
import React from 'react';
import { state } from '../../models/state';

export const PrivateRoute = ({component: Component, authenticated, permit, ...rest}) => {
    if (authenticated === true && (permit === true || permit === undefined)) {
        return <Route {...rest} render={(props) => (
            <Component {...props} />
        )}/>
    }
    window.location.href = state.configurations.SPARK_HOST ||
    process.env.NODE_ENV === 'production' ? 'https://spark.midburn.org' : 'http://localhost:3000';
};
