import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';

import { AppNavigation } from './components/AppNavigation';
import { Layout } from './components/Layout';
import { InitilizationService } from './services/initialization';
import { Loader } from './components/Loader';
import { withNamespaces } from 'react-i18next';

class App extends Component {

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
            this.setState({
                loading: false
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
            <div className="App">
                {this.props.lng === 'he' ? <link rel="stylesheet" href="//cdn.rawgit.com/morteza/bootstrap-rtl/v3.3.4/dist/css/bootstrap-rtl.min.css" /> : null }
                { this.state.loading ? <Loader /> : <BrowserRouter>
                    <div>
                        <AppNavigation />
                        <Layout />
                    </div>
                </BrowserRouter> }

            </div>
        );
    }
}

export default withNamespaces()(App);
