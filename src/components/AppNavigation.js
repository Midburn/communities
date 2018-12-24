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
import { LinkContainer } from 'react-router-bootstrap';
import i18n from '../services/i18n';
import { withI18n } from 'react-i18next';
import Flag from "react-flags";
import './AppNavigation.scss';
import { withRouter } from 'react-router-dom';
import { AuthService } from '../services/auth';
import { CONSTANTS } from '../models/constants';

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
            pngSize={16}
            basePath="img/flags"
            shiny={true}
            alt={lngToFlagNameDict[lng] + 'Flag'}
        />
    };

    toggleCollapse = (e) => {
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

    render() {
        const { t, lng, location } = this.props;
        return (
            <Navbar color="white" light className={this.getNavClass(lng)} expand="md" scrolling fixed="top">
                <NavbarBrand>
                    <LinkContainer to="/">
                        <div className="nav-home-btn">{t('home')}</div>
                    </LinkContainer>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse} />
                <Collapse isOpen={this.state.collapse} navbar>
                    <NavbarNav left>
                        {this.state.links.map((link, index)=> {
                            return (
                                <NavItem key={link} active={ location.pathname.includes(link) }>
                                    <NavLink to={`../${link}`}>{t(link)}</NavLink>
                                </NavItem>
                            )
                        })}
                    </NavbarNav>
                    <NavbarNav className="right-nav" right>
                        <NavItem>
                            <Dropdown id="basic-nav-dropdown">
                                <DropdownToggle nav caret>{this.getFlag(lng)}</DropdownToggle>
                                <DropdownMenu basic>
                                    <DropdownItem onClick={() => this.changLng('en')}>
                                        {t('en')}
                                        <Flag
                                            name="US"
                                            format="png"
                                            pngSize={16}
                                            basePath="img/flags"
                                            shiny={true}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.changLng('he')}>
                                        {t('he')}
                                        <Flag
                                            name="IL"
                                            format="png"
                                            pngSize={16}
                                            basePath="img/flags"
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

export const AppNavigation = withRouter(withI18n()(BaseAppNavigation));