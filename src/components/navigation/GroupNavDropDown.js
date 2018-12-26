import React from 'react';
import { NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'mdbreact';
import {NavLink} from "react-router-dom";

/**
 * Renders drop down based on group type
 * @param type: from constanst group types
 * @returns {*}
 * @constructor
 */
export const GroupDropDown = ({ type, t }) => {

    function getTranslateModule() {
        return `common.nav.${type}`;
    }

    function getPloral() {
        return `${type}s`;
    }

    function getMyGroupId() {
        // TODO - get group id;
        return;
    }

    return (
        <NavItem>
            <Dropdown id={`${type}-nav-fropdown`}>
                <DropdownToggle nav caret>{t(`${getTranslateModule()}.title`)}</DropdownToggle>
                <DropdownMenu basic>
                    {/*SEARCH GROUPS LINK*/}
                    <DropdownItem onClick={() => {this.toggleCollapse(); this.changLng('en')}}>
                        <NavLink to={`/${getPloral()}/search`}/>
                    </DropdownItem>
                    {/*MY GROUPS LINK*/}
                    <DropdownItem onClick={() => {this.toggleCollapse(); this.changLng('en')}}>
                        <NavLink to={`/${getPloral()}/${getMyGroupId()}`}/>
                    </DropdownItem>
                    {/*MANAGE MY GROUP LINK*/}
                    <DropdownItem onClick={() => {this.toggleCollapse(); this.changLng('en')}}>
                        <NavLink to={`/${getPloral()}/${getMyGroupId()}/manage`}/>
                    </DropdownItem>
                    {/*MANAGE GROUPS LINK*/}
                    <DropdownItem onClick={() => {this.toggleCollapse(); this.changLng('en')}}>
                        <NavLink to={`/${getPloral()}/management`}/>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </NavItem>
    );
};
