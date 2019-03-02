import React from 'react';
import {
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink,
} from 'mdbreact';
import {PermissableComponent} from '../controls/PermissableComponent';
import {PermissionService} from '../../services/permissions';
import {GroupsService} from '../../services/groups';
import {ParsingService} from '../../services/parsing';
import * as classnames from 'classnames';
import * as constants from '../../../models/constants';
/**
 * Renders drop down based on group type
 * @param type: from constanst group types
 * @returns {*}
 * @constructor
 */
export const GroupDropDown = ({type, t, onClick, lng}) => {
  const groupsService = new GroupsService ();
  const permissionsService = new PermissionService ();
  const parsingService = new ParsingService ();

  function getTranslateModule () {
    return `nav.${parsingService.getPlural (type)}`;
  }

  function getMyGroupId () {
    return groupsService.getUsersGroupId (type);
  }

  const dropdownToggleClassname = classnames({
    disabled: type === constants.GROUP_TYPES.ART
  });

  return (
    <NavItem>
      <Dropdown id={`${type}-nav-fropdown`}>
        <DropdownToggle className={dropdownToggleClassname} nav>
          {t (`${getTranslateModule ()}.title`)}
        </DropdownToggle>
        <DropdownMenu basic>
          {/*SEARCH GROUPS LINK*/}
          <DropdownItem className="disabled" onClick={onClick}>
            <NavLink to={`/${lng}/${parsingService.getPlural (type)}`}>
              {t (`${getTranslateModule ()}.search`)}
            </NavLink>
          </DropdownItem>
          {/*MY GROUPS LINK*/}
          <PermissableComponent permitted={permissionsService.hasGroup (type)}>
            <DropdownItem onClick={onClick}>
              <NavLink
                to={`/${lng}/${parsingService.getPlural (type)}/${getMyGroupId ()}`}
              >
                {t (`${getTranslateModule ()}.my`)}
              </NavLink>
            </DropdownItem>
          </PermissableComponent>
          {/*MANAGEMENT LINK*/}
          <PermissableComponent permitted={permissionsService.canManageGroups(type)}>
            <DropdownItem onClick={onClick}>
              <NavLink
                  to={`/${lng}/${parsingService.getPlural(type)}/management`}>{t(`nav.${parsingService.getPlural(type)}.management`)}</NavLink>
            </DropdownItem>
          </PermissableComponent>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  );
};
