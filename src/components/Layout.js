import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Main } from './Main';
import { Login } from './Login';
import { CookieError, InitilizationService } from '../services/initialization';
import { Loader } from './Loader';
import { PrivateRoute } from './PrivateRoute';

export class BaseLayout extends Component {
    initService = new InitilizationService();

    constructor(props) {
        super(props);
        this.init();
    }

    state = {
        loading: true,
        err: null,
        authenticated: false
    };

    async init() {
        try {
            if (this.props.location.pathname === '/login') {
                this.props.history.push('/');
            }
            this.setState({
                loading: false,
                authenticated: await this.initService.init()
            });
        } catch (err) {
            this.setState({
                loading: false,
                err
            });
            // if (err instanceof CookieError) {
            //     this.props.history.push('/login');
            // }
        }

    }
    render() {
        return (
            <div className="Layout">
                { this.state.loading ? <Loader /> :
                    <Switch>
                        <Route path="/login" component={Login} />
                        <PrivateRoute path="/" authenticated={this.state.authenticated} component={Main}></PrivateRoute>
                    </Switch> }
            </div>
        );
    }
}

export const Layout = withRouter(BaseLayout);
