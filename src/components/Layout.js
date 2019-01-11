import React, { Component } from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import { Main } from './Main';
import { InitilizationService } from '../services/initialization';
import { Loader } from './Loader';
import { PrivateRoute } from './navigation/PrivateRoute';
import { NotFound } from './NotFound';
import { state } from '../models/state';
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
            state.authenticated = await this.initService.init();
            this.setState({
                loading: false,
            });
        } catch (err) {
            this.setState({
                loading: false,
                err
            });
        }

    }
    render() {
        return (
            <div className="Layout">
                { this.state.loading ? <Loader /> :
                    <div>
                        <Switch>
                            <PrivateRoute path="/:lng(en|he)" component={Main}/>
                            <Redirect path="/" to="/he/camps"  exact />
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                     }
            </div>
        );
    }
}

export const Layout = withRouter(BaseLayout);
