import React from 'react';
import { Button, MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import i18n from '../services/i18n';
import { withI18n } from 'react-i18next';
import Flag from "react-flags";
import './AppNavigation.scss';
import { withRouter } from 'react-router-dom';

const BaseAppNavigation = (props) => {
    const { t, lng } = props;

    const changLng = (lng) => {
        i18n.changeLanguage(lng);
    };

    const getFlag = (lng) => {
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

    const logout = () => {
        function deleteAllCookies() {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
        deleteAllCookies();
        props.history.push('/login');
    };

    return (
            <Navbar className="Navbar">
                <Navbar.Header>
                    <Navbar.Brand>
                    <LinkContainer to="/">
                        <div className="nav-home-btn">{t('home')}</div>
                    </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/camps">
                            <NavItem eventKey={1}>
                                {t('camps')}
                            </NavItem>
                        </LinkContainer>
                        <LinkContainer to="/arts">
                            <NavItem eventKey={2}>
                                {t('arts')}
                            </NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullLeft={lng === 'he'} pullRight={lng === 'en'}>
                        <NavDropdown eventKey={3} title={getFlag(lng)} id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1} onSelect={() => changLng('en')}>{t('en')} <Flag
                                name="US"
                                format="png"
                                pngSize={16}
                                basePath="img/flags"
                                shiny={true}
                            /></MenuItem>
                            <MenuItem eventKey={3.2} onSelect={() =>changLng('he')}>{t('he')} <Flag
                                name="IL"
                                format="png"
                                pngSize={16}
                                basePath="img/flags"
                                shiny={true}
                            /></MenuItem>
                        </NavDropdown>
                        <NavItem eventKey={4} onClick={logout}>
                            {t('logout')}
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
};

export const AppNavigation = withRouter(withI18n()(BaseAppNavigation));