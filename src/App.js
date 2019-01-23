import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import { Layout } from './components/Layout';
import { withNamespaces } from 'react-i18next';

class App extends Component {

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                        <Layout />
                </BrowserRouter> 
            </div>
        );
    }
}

export default withNamespaces()(App);