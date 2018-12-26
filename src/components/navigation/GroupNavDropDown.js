import React from 'react';
import { NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import { NavLink } from "react-router-dom";
import { PermissableComponent } from '../controls/PermissableComponent';
import { PermissionService } from '../../services/permissions';
import { GroupsService } from '../../services/groups';

/**
 * Renders drop down based on group type
 * @param type: from constanst group types
 * @returns {*}
 * @constructor
 */
export const GroupDropDown = ({type, t, onClick, lng}) => {

    const groupsService = new GroupsService();
    const permissionsService = new PermissionService();

    function getPlural() {
        return `${type}s`;
    }

    function getTranslateModule() {
        return `nav.${getPlural()}`;
    }

    function getMyGroupId() {
        return groupsService.getUsersGroupId(type);
    }

    return (
        <NavItem>
            <Dropdown id={`${type}-nav-fropdown`}>
                <DropdownToggle nav caret>{t(`${getTranslateModule()}.title`)}</DropdownToggle>
                <DropdownMenu basic>
                    {/*SEARCH GROUPS LINK*/}
                    <DropdownItem onClick={onClick}>
                        <NavLink to={`/${lng}/${getPlural()}`}>{t(`${getTranslateModule()}.search`)}</NavLink>
                    </DropdownItem>
                    {/*MY GROUPS LINK*/}
                    <PermissableComponent permitted={permissionsService.hasGroup(type)}>
                        <DropdownItem onClick={onClick}>
                            <NavLink
                                to={`/${lng}/${getPlural()}/${getMyGroupId()}`}>{t(`${getTranslateModule()}.my`)}</NavLink>
                        </DropdownItem>
                    </PermissableComponent>
                    {/*MANAGE MY GROUP LINK*/}
                    <PermissableComponent permitted={permissionsService.isGroupManager(type)}>
                        <DropdownItem onClick={onClick}>
                            <NavLink
                                to={`/${lng}/${getPlural()}/${getMyGroupId()}/manage`}>{t(`${getTranslateModule()}.manage`)}</NavLink>
                        </DropdownItem>
                    </PermissableComponent>
                    {/*MANAGE GROUPS LINK*/}
                    <PermissableComponent permitted={permissionsService.isAdmin()}>
                        <DropdownItem onClick={onClick}>
                            <NavLink
                                to={`/${lng}/${getPlural()}/management`}>{t(`${getTranslateModule()}.management`)}</NavLink>
                        </DropdownItem>
                    </PermissableComponent>
                </DropdownMenu>
            </Dropdown>
        </NavItem>
    );
};
