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
    NavLink
} from 'mdbreact';
import i18n from '../../services/i18n';
import Flag from "react-flags";
import './AppNavigation.scss';
import { withRouter } from 'react-router-dom';
import { AuthService } from '../../services/auth';
import { withNamespaces } from 'react-i18next';
import { state } from '../../models/state';
import * as constants from '../../../models/constants';
import { GroupDropDown } from './GroupNavDropDown';
import { AbsoluteNavLink } from './AbsoluteNavLink';
import { PermissableComponent } from '../controls/PermissableComponent';
import { ParsingService } from '../../services/parsing';
import { PermissionService } from '../../services/permissions';

class BaseAppNavigation extends Component {

    auth = new AuthService();
    parsingService = new ParsingService();
    permissionsService = new PermissionService();

    state = {
        collapse: false,
        links: Object.values(constants.GROUP_TYPES)
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
        window.location.href = state.configurations.SPARK_HOST;
    };

    getSparkLink(relative) {
        return `${state.configurations.SPARK_HOST}/${relative}`;
    }

    render() {
        const {t, lng} = this.props;

        return (
            <Navbar color="white" light className={this.getNavClass(lng)} expand="md" scrolling fixed="top">
                <NavbarBrand className="NavbarBrand" onClick={this.backToSpark}>
                    <div>Spark</div>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse}/>
                <Collapse isOpen={this.state.collapse} navbar>
                    <NavbarNav left>
                        {this.state.links.map((type, index) => {
                            return (
                                <GroupDropDown key={index} t={t} lng={lng} onClick={this.toggleCollapse} type={type}/>
                            )
                        })}
                        <NavItem>
                            <AbsoluteNavLink
                                to={this.getSparkLink('he/volunteering')}>{t('volunteering')}</AbsoluteNavLink>
                        </NavItem>
                        <PermissableComponent permitted={state.loggedUser.isAdmin || state.loggedUser.isGateManager}>
                            <NavItem>
                                <Dropdown id="basic-nav-dropdown">
                                    <DropdownToggle nav caret>{t('nav.gate.title')}</DropdownToggle>
                                    <DropdownMenu basic>
                                        <DropdownItem onClick={this.toggleCollapse}>
                                            <NavItem>
                                                <AbsoluteNavLink
                                                    to={this.getSparkLink('he/gate')}>{t('nav.gate.manage')}</AbsoluteNavLink>
                                            </NavItem>
                                        </DropdownItem>
                                        <DropdownItem onClick={this.toggleCollapse}>
                                            <NavItem>
                                                <AbsoluteNavLink
                                                    to={this.getSparkLink('he/gate/suppliers')}>{t('nav.gate.suppliers')}</AbsoluteNavLink>
                                            </NavItem>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </NavItem>
                        </PermissableComponent>
                        <PermissableComponent
                            permitted={state.loggedUser.isAllowedToViewSuppliers || state.loggedUser.isAdmin}>
                            <NavItem>
                                <Dropdown id="basic-nav-dropdown">
                                    <DropdownToggle nav caret>{t('nav.management.title')}</DropdownToggle>
                                    <DropdownMenu basic>
                                        <PermissableComponent permitted={state.loggedUser.isAllowedToViewSuppliers}>
                                            <DropdownItem onClick={this.toggleCollapse}>
                                                <NavItem>
                                                    <AbsoluteNavLink
                                                        to={this.getSparkLink('en/suppliers-admin')}>{t('nav.management.suppliers')}</AbsoluteNavLink>
                                                </NavItem>
                                            </DropdownItem>
                                        </PermissableComponent>
                                        <PermissableComponent
                                            permitted={state.loggedUser.isCampsAdmin || state.loggedUser.isAdmin}>
                                            <DropdownItem onClick={this.toggleCollapse}>
                                                <NavItem>
                                                    <AbsoluteNavLink
                                                        to={this.getSparkLink('/en/camp-files-admin')}>{t('nav.management.files')}</AbsoluteNavLink>
                                                </NavItem>
                                            </DropdownItem>
                                        </PermissableComponent>
                                        <PermissableComponent permitted={state.loggedUser.isAdmin}>
                                            <DropdownItem onClick={this.toggleCollapse}>
                                                <NavItem>
                                                    <AbsoluteNavLink
                                                        to={this.getSparkLink('/en/events-admin')}>{t('nav.management.events')}</AbsoluteNavLink>
                                                </NavItem>
                                            </DropdownItem>
                                        </PermissableComponent>
                                        {this.state.links.map(groupType => {
                                            return (
                                                <PermissableComponent key={groupType}
                                                                      permitted={this.permissionsService.isAdmin()}>
                                                    <DropdownItem onClick={this.toggleCollapse}>
                                                        <NavLink
                                                            to={`/${lng}/${this.parsingService.getPlural(groupType)}/management`}>{t(`nav.${this.parsingService.getPlural(groupType)}.management`)}</NavLink>
                                                    </DropdownItem>
                                                </PermissableComponent>
                                            );
                                        })}
                                    </DropdownMenu>
                                </Dropdown>
                            </NavItem>
                        </PermissableComponent>
                    </NavbarNav>
                    <NavbarNav className="right-nav" right>
                        {state.allocationGroups.map(group => {
                            return (
                                <PermissableComponent key={group.id}
                                                      permitted={!!constants.SPARK_TYPES_TO_GROUP_TYPES[group.__prototype]}>
                                    <NavItem onClick={this.toggleCollapse}>
                                        <NavLink
                                            to={`/${lng}/${this.parsingService.getPlural(constants.SPARK_TYPES_TO_GROUP_TYPES[group.__prototype])}/${group.id}/allocations`}>
                                            {t(`nav.${this.parsingService.getPlural(constants.SPARK_TYPES_TO_GROUP_TYPES[group.__prototype])}.allocate`)}
                                        </NavLink>
                                    </NavItem>
                                </PermissableComponent>
                            );
                        })}
                        <NavItem>
                            <Dropdown id="basic-nav-dropdown">
                                <DropdownToggle nav caret>{this.getFlag(lng)}</DropdownToggle>
                                <DropdownMenu basic>
                                    <DropdownItem onClick={() => {
                                        this.toggleCollapse();
                                        this.changLng('en')
                                    }}>
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
                                    <DropdownItem onClick={() => {
                                        this.toggleCollapse();
                                        this.changLng('he')
                                    }}>
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