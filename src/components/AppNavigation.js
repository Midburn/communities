import React, { Component } from 'react';
import {
    Dropdown,
    DropdownItem,
    NavbarNav,
    Collapse,
    Navbar,
    NavbarBrand,
    DropdownToggle,
    NavItem,
    DropdownMenu,
    NavbarToggler,
    NavLink } from 'mdbreact';
import i18n from '../services/i18n';
import Flag from "react-flags";
import './AppNavigation.scss';
import { withRouter } from 'react-router-dom';
import { AuthService } from '../services/auth';
import { CONSTANTS } from '../models/constants';
import { withNamespaces } from 'react-i18next';

class BaseAppNavigation extends Component {

    auth = new AuthService();
    state = {
        collapse: false,
        links: CONSTANTS.GROUP_TYPES
    };

    changLng = (lng) => {
        i18n.changeLanguage(lng);
    };

    getFlag = (lng) => {
        const lngToFlagNameDict = {
            he: 'IL',
            en: 'US'
        };
        return <Flag
            country={lngToFlagNameDict[lng]}
            name={lngToFlagNameDict[lng]}
            format="png"
            pngSize={32}
            basePath="/img/flags"
            shiny={true}
            alt={lngToFlagNameDict[lng] + 'Flag'}
        />
    };

    toggleCollapse = () => {
        this.setState({
            collapse: !this.state.collapse
        })
    };

    logout = () => {
        // TODO - log out using spark
        this.auth.logOut();
    };

    getNavClass = (lng) => {
        let className = 'Navbar';
        return lng === 'he' ? className += ' rtl' : className;
    };

    backToSpark = (e) => {
        window.location.href = 'http://localhost:3000';
    };

    render() {
        const { t, lng, location } = this.props;
        return (
            <Navbar color="white" light className={this.getNavClass(lng)} expand="md" scrolling fixed="top">
                <NavbarBrand className="NavbarBrand" onClick={this.backToSpark}>
                        <div>Spark</div>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse} />
                <Collapse isOpen={this.state.collapse} navbar>
                    <NavbarNav left>
                        {this.state.links.map((link, index)=> {
                            return (
                                <NavItem onClick={this.toggleCollapse} key={link} active={ location.pathname.includes(link) }>
                                    <NavLink to={`/${lng}/${link}`}>{t(link)}</NavLink>
                                </NavItem>
                            )
                        })}
                    </NavbarNav>
                    <NavbarNav className="right-nav" right>
                        <NavItem>
                            <Dropdown id="basic-nav-dropdown">
                                <DropdownToggle nav caret>{this.getFlag(lng)}</DropdownToggle>
                                <DropdownMenu basic>
                                    <DropdownItem onClick={() => {this.toggleCollapse(); this.changLng('en')}}>
                                        {t('en')}
                                        <Flag
                                            name="US"
                                            country="US"
                                            format="png"
                                            pngSize={32}
                                            basePath="/img/flags"
                                            shiny={true}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => {this.toggleCollapse(); this.changLng('he')}}>
                                        {t('he')}
                                        <Flag
                                            name="IL"
                                            country="IL"
                                            format="png"
                                            pngSize={32}
                                            basePath="/img/flags"
                                            shiny={true}
                                        />
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        <NavItem onClick={this.logout}>
                            <NavLink to={'#'}>{t('logout')}</NavLink>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}

export const AppNavigation = withRouter(withNamespaces()(BaseAppNavigation));