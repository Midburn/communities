import React from 'react';
import { NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import { NavLink } from "react-router-dom";
import { PermissableComponent } from '../controls/PermissableComponent';
import { PermissionService } from '../../services/permissions';
import { GroupsService } from '../../services/groups';
import { ParsingService } from '../../services/parsing';
import { EventRulesService } from '../../services/event-rules';

/**
 * Renders drop down based on group type
 * @param type: from constanst group types
 * @returns {*}
 * @constructor
 */
export const GroupDropDown = ({type, t, onClick, lng}) => {

    const groupsService = new GroupsService();
    const permissionsService = new PermissionService();
    const parsingService = new ParsingService();
    const eventRulesService = new EventRulesService();

    function getTranslateModule() {
        return `nav.${parsingService.getPlural(type)}`;
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
                        <NavLink to={`/${lng}/${parsingService.getPlural(type)}`}>{t(`${getTranslateModule()}.search`)}</NavLink>
                    </DropdownItem>
                    {/*MY GROUPS LINK*/}
                    <PermissableComponent permitted={permissionsService.hasGroup(type)}>
                        <DropdownItem onClick={onClick}>
                            <NavLink
                                to={`/${lng}/${parsingService.getPlural(type)}/${getMyGroupId()}`}>{t(`${getTranslateModule()}.my`)}</NavLink>
                        </DropdownItem>
                    </PermissableComponent>
                    {/*MANAGE MY GROUP LINK*/}
                    <PermissableComponent permitted={permissionsService.isGroupManager(type) && !eventRulesService.isGroupEditingDisabled(type)}>
                        <DropdownItem onClick={onClick}>
                            <NavLink
                                to={`/${lng}/${parsingService.getPlural(type)}/${getMyGroupId()}/manage`}>{t(`${getTranslateModule()}.manage`)}</NavLink>
                        </DropdownItem>
                    </PermissableComponent>
                </DropdownMenu>
            </Dropdown>
        </NavItem>
    );
};
