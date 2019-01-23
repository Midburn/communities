import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css';
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