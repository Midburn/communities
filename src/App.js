import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';

import { Layout } from './components/Layout';
import { withNamespaces } from 'react-i18next';

class App extends Component {

    render() {
        return (
            <div className="App">
                {this.props.lng === 'he' ? <link rel="stylesheet" href="//cdn.rawgit.com/morteza/bootstrap-rtl/v3.3.4/dist/css/bootstrap-rtl.min.css" /> : null }
                <BrowserRouter>
                        <Layout />
                </BrowserRouter> }
            </div>
        );
    }
}

export default withNamespaces()(App);
