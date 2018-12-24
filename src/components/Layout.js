import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Main } from './Main';
import { InitilizationService } from '../services/initialization';
import { Loader } from './Loader';
import { PrivateRoute } from './PrivateRoute';
import { NotFound } from './NotFound';

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
            this.setState({
                loading: false,
                authenticated: await this.initService.init()
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
                    <Switch>
                        <PrivateRoute path="/:lng(en|he)" authenticated={this.state.authenticated} component={Main} />
                        <Route component={NotFound}/>
                    </Switch> }
            </div>
        );
    }
}

export const Layout = withRouter(BaseLayout);
