import React from 'react';
import { NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, MDBBadge, MDBIcon } from 'mdbreact';
import { NavLink } from "react-router-dom";
import { PermissableComponent } from '../controls/PermissableComponent';
import { PermissionService } from '../../services/permissions';
import { GroupsService } from '../../services/groups';
import { ParsingService } from '../../services/parsing';
import { EventRulesService } from '../../services/event-rules';
import { state } from '../../models/state';
import * as constants from '../../../models/constants';
import colors from '../../styles/_colors.scss';
import { IoIosBonfire } from 'react-icons/io';
/**
 * Renders drop down based on group type
 * @param type: from constanst group types
 * @returns {*}
 * @constructor
 */
export const AllocationsDropDown = ({type, t, onClick, lng}) => {

    const groupsService = new GroupsService();
    const permissionsService = new PermissionService();
    const parsingService = new ParsingService();
    const eventRulesService = new EventRulesService();

    const hasAllocationGroups = !!state.allocationGroups && eventRulesService.isPresaleAvailable;
    const isAllocationAdmin = !!permissionsService.isAdmin() && eventRulesService.isPresaleAvailable;
    console.log(colors)
    return (
        <PermissableComponent permitted={hasAllocationGroups || isAllocationAdmin}>
            <NavItem>
                <Dropdown id={`${type}-nav-fropdown`}>
                    <DropdownToggle nav caret>
                        {t(`nav.allocations.title`, {year: state.currentEventId.match(/\d+/)[0]})}
                        <MDBBadge className={`ml-2 mr-2 ${colors.yellow}`}>
                            <IoIosBonfire />{t('new')}!
                        </MDBBadge>
                    </DropdownToggle>
                    <DropdownMenu basic>
                        {(state.allocationGroups || []).map(group => {
                            return (
                                <PermissableComponent key={group.id}
                                                      permitted={!!constants.SPARK_TYPES_TO_GROUP_TYPES[group.__prototype] &&
                                                      eventRulesService.isPresaleAvailable &&
                                                      permissionsService.isAllowedToAllocateTickets(group.id)}>
                                    <DropdownItem onClick={onClick}>
                                        <NavLink
                                            to={`/${lng}/${parsingService.getPlural(constants.SPARK_TYPES_TO_GROUP_TYPES[group.__prototype])}/${group.id}/allocations`}>
                                            {groupsService.getPropertyByLang(group, 'name')}
                                        </NavLink>
                                    </DropdownItem>
                                </PermissableComponent>
                            );
                        })}
                        {Object.values(constants.GROUP_TYPES).map(groupType => {
                            // TODO - not only admin - more roles needed.
                            return (
                                <PermissableComponent key={groupType}
                                                      permitted={!!permissionsService.isAdmin() && eventRulesService.isPresaleAvailable}>
                                    <DropdownItem onClick={onClick}>
                                        <NavLink
                                            to={`/${lng}/${parsingService.getPlural(groupType)}/allocations`}>
                                            {t(`nav.${parsingService.getPlural(groupType)}.allocateAdmin`)}
                                        </NavLink>
                                    </DropdownItem>
                                </PermissableComponent>
                            );
                        })}
                    </DropdownMenu>
                </Dropdown>
            </NavItem>
        </PermissableComponent>
    );
};
