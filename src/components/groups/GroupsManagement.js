import React from 'react';
import {Col, Row} from 'mdbreact';
import {withI18n} from 'react-i18next';
import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
import {state} from '../../models/state';
import * as constants from '../../../models/constants';
import {GroupsTable} from './GroupsTable';
import {ParsingService} from '../../services/parsing';
import {GroupsService} from '../../services/groups';
import {Tabs} from '../controls/Tabs';
import {EventRulesService} from '../../services/event-rules';
import {PermissionService} from '../../services/permissions';
import {Loader} from '../Loader';

@observer class BaseGroupsManagement extends React.Component {
  parsingService = new ParsingService ();
  groupService = new GroupsService ();
  eventRules = new EventRulesService ();
  permissionsService = new PermissionService ();
  @observable error;

  @observable groups = [];

  @observable query = '';
  @observable loading = true;

  getTranslatePath (type) {
    return `${type}:management`;
  }

  @observable activeTab = 1;

  constructor (props) {
    super (props);
    this.checkPermissions (props);
    this.init (props);
    if (props.location.hash) {
      this.setActiveTab (props.location.hash.replace ('#', ''));
    }
  }

  checkPermissions (props) {
    const {match} = props;
    if (
      !this.permissionsService.isAllowedToManageGroups (match.params.groupType)
    ) {
      this.permissionsService.redirectToSpark ();
    }
  }

  setActiveTab (tab) {
    tab = +tab;
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.props.history.push ({
        hash: `#${tab}`,
        search: this.props.location.search,
      });
    }
  }

  @computed get listData () {
    const {match} = this.props;
    const type = match.params.groupType;
    return type.includes (constants.GROUP_TYPES.CAMP)
      ? state.camps
      : state.artInstallations;
  }

  componentWillReceiveProps (props) {
    this.init (props);
  }

  async init (props) {
    try {
      const {match} = props;
      this.loading = true;
      this.groups = (await this.groupService.getAllGroups (
        this.parsingService.getGroupTypeFromString (match.params.groupType)
      )) || [];
      this.loading = false;
      this.getGroupsTickets ();
    } catch (e) {
      this.loading = false;
      this.groups = [];
      // TODO - what do we do with errors?
      this.error = e;
    }
  }

  /**
   * For displaying ticket count (for this event)
   * @returns {Promise<void>}
   */
  async getGroupsTickets () {
    try {
      const tickets = await this.groupService.getAllCampsMembersTickets (
        this.groups.map (g => g.id)
      );
      if (!tickets || !Object.keys (tickets).length) {
        return;
      } else {
        for (const group of this.groups) {
          group.tickets = tickets[group.id];
        }
      }
    } catch (e) {
      // TODO - what do we do with errors?
      console.warn (e);
    }
  }

  /**
     * Filter related methods (change, filter, match)
     */
  @action handleChange = e => {
    this.query = e.target.value;
  };

  filter = member => {
    if (!this.query || !this.query.length) {
      // No query given - should return all camps
      return true;
    }
    return this.match (member);
  };

  match (group) {
    for (const searchProp of [
      group.camp_name_he || '',
      group.camp_name_en || '',
      group.contact_person_name || '',
      group.contact_person_email || '',
      group.contact_person_phone || '',
    ]) {
      if (searchProp.toLowerCase ().includes (this.query)) {
        return true;
      }
    }
    return false;
  }

  render () {
    const {t, match} = this.props;
    const type = match.params.groupType;
    const tabs = [
      {
        id: 1,
        title: t (`${this.getTranslatePath (type)}.tabs.groups`),
        component: <GroupsTable key={1} groups={this.groups} />,
      },
    ];
    return (
      <div>

        <Row>
          <Col md="12">
            <h1>{t (`${this.getTranslatePath (type)}.header`)}</h1>
          </Col>
        </Row>
        <Row>
          {this.loading
            ? <Loader />
            : <Col>
                <Tabs
                  tabs={tabs}
                  selectedId={this.activeTab}
                  onSelect={e => this.setActiveTab (e)}
                />
              </Col>}

        </Row>
      </div>
    );
  }
}

export const GroupsManagement = withI18n () (BaseGroupsManagement);
