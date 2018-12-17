import React, { Component } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';
import { Main } from './Main';
import { Login } from './Login';
import { CookieError, InitilizationService } from '../services/initialization';
import { Loader } from './Loader';

export class BaseLayout extends Component {
    initService = new InitilizationService();

    constructor(props) {
        super(props);
        this.init();
    }

    state = {
        loading: true,
        err: null
    };

    async init() {
        try {
            await this.initService.init();
            if (this.props.location.pathname === '/login') {
                this.props.history.push('/');
            }
            this.setState({
                loading: false
            });
        } catch (err) {
            this.setState({
                loading: false,
                err
            });
            if (err instanceof CookieError) {
                this.props.history.push('/login');
            }
        }

    }
    render() {
        return (
            <div className="Layout">
                { this.state.loading ? <Loader /> :
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/" component={Main}></Route>
                    </Switch> }
            </div>
        );
    }
}

export const Layout = withRouter(BaseLayout);
