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
    NavLink,
    MDBBtn
} from 'mdbreact';
import i18n from '../../services/i18n';
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
import { EventRulesService } from '../../services/event-rules';
import { AllocationsDropDown } from './AllocationNav';

class BaseAppNavigation extends Component {

    auth = new AuthService();
    parsingService = new ParsingService();
    permissionsService = new PermissionService();
    eventRules = new EventRulesService();

    state = {
        collapse: false,
        links: Object.values(constants.GROUP_TYPES)
    };

    changLng = () => {
        i18n.changeLanguage(i18n.language === 'he' ? 'en' : 'he');
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

    getToggledLngUrl() {
        const {lng, location} = this.props;
        return location.pathname.replace(lng, lng === 'he' ? 'en' : 'he');
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
                                    <DropdownToggle nav>{t('nav.gate.title')}</DropdownToggle>
                                    <DropdownMenu basic>
                                        <DropdownItem onClick={this.toggleCollapse}>
                                            <NavItem>
                                                <AbsoluteNavLink
                                                    to={this.getSparkLink(`${lng}/gate`)}>{t('nav.gate.manage')}</AbsoluteNavLink>
                                            </NavItem>
                                        </DropdownItem>
                                        <DropdownItem onClick={this.toggleCollapse}>
                                            <NavItem>
                                                <AbsoluteNavLink
                                                    to={this.getSparkLink(`${lng}/gate/suppliers`)}>{t('nav.gate.suppliers')}</AbsoluteNavLink>
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
                                    <DropdownToggle nav>{t('nav.management.title')}</DropdownToggle>
                                    <DropdownMenu basic>
                                        <PermissableComponent permitted={state.loggedUser.isAllowedToViewSuppliers}>
                                            <DropdownItem onClick={this.toggleCollapse}>
                                                <NavItem>
                                                    <AbsoluteNavLink
                                                        to={this.getSparkLink(`${lng}/suppliers-admin`)}>{t('nav.management.suppliers')}</AbsoluteNavLink>
                                                </NavItem>
                                            </DropdownItem>
                                        </PermissableComponent>
                                        <PermissableComponent
                                            permitted={state.loggedUser.isCampsAdmin || state.loggedUser.isAdmin}>
                                            <DropdownItem onClick={this.toggleCollapse}>
                                                <NavItem>
                                                    <AbsoluteNavLink
                                                        to={this.getSparkLink(`${lng}/camp-files-admin`)}>{t('nav.management.files')}</AbsoluteNavLink>
                                                </NavItem>
                                            </DropdownItem>
                                        </PermissableComponent>
                                        <PermissableComponent permitted={state.loggedUser.isAdmin}>
                                            <DropdownItem onClick={this.toggleCollapse}>
                                                <NavItem>
                                                    <AbsoluteNavLink
                                                        to={this.getSparkLink(`${lng}/events-admin`)}>{t('nav.management.events')}</AbsoluteNavLink>
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
                        <AllocationsDropDown onClick={this.toggleCollapse} t={t} lng={lng}/>
                    </NavbarNav>
                    <NavbarNav className="right-nav" right>
                        <NavItem onClick={this.toggleCollapse} className="d-flex align-items-center">
                            <NavLink onClick={this.changLng}
                                     to={this.getToggledLngUrl()}>
                                <span className={`${lng === 'he' ? 'font-weight-bold' : 'font-weight-light'}`}>{t('he')}</span> / <span className={`${lng === 'en' ? 'font-weight-bold' : 'font-weight-light'}`}>{t('en')}</span>
                            </NavLink>
                        </NavItem>
                        <NavItem >
                            <MDBBtn className={"border-blue text-blue"} outline color="primary" onClick={this.logout}>{t('logout')}</MDBBtn>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}


export const AppNavigation = withRouter(withNamespaces()(BaseAppNavigation));