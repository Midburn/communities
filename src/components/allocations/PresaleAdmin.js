import React from 'react';
import {withI18n} from 'react-i18next';
import {withRouter} from 'react-router-dom';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Row, Col} from 'mdbreact';
import {GroupsTable} from '../groups/GroupsTable';
import {GroupsService} from '../../services/groups';
import {ParsingService} from '../../services/parsing';
import {EventsService} from '../../services/events';
import {AuditService} from '../../services/audit';
import * as constants from '../../../models/constants';
import './PresaleAdmin.scss';
import Moment from 'react-moment';
import {UsersService} from '../../services/users';
import {AllocationService} from '../../services/allocations';
import {action} from 'mobx/lib/mobx';
import {SearchInput} from '../controls/SearchInput';
import {PermissableComponent} from '../controls/PermissableComponent';
import {BarChartCard} from '../controls/BarChartCard';

@observer class BasePresaleAdmin extends React.Component {
  parsingService = new ParsingService ();
  groupService = new GroupsService ();
  eventsService = new EventsService ();
  auditService = new AuditService ();
  usersService = new UsersService ();
  allocationsService = new AllocationService ();
  /**
     * We'll keep track of groups changed in order to send them on save.
     */
  @observable error;

  @observable groups = [];

  @observable audits = [];

  @observable auditedUser = [];

  @observable allocations = [];

  @observable isLoading = true;

  @observable groupQuotas = [];

  @observable query = '';

  get lastAudit () {
    if (!this.audits || !this.audits.length || !this.audits[0]) {
      return null;
    }
    return this.audits[0].createdAt;
  }

  constructor (props) {
    super (props);
    this.init (props);
  }

  componentWillReceiveProps (props) {
    if (!this.isLoading) {
      this.init (props);
    }
  }

  async init (props) {
    try {
      const {match} = props;
      this.isLoading = true;
      this.groups = (await this.groupService.getAllGroups (
        this.parsingService.getGroupTypeFromString (match.params.groupType),
        this.eventsService.getFormerEventId ()
      )) || [];
      await this.getGroupsTickets ();
      await this.getGroupsFormerEventTickets ();
      await this.getAdminAllocations ();
      await this.getGroupsAllocations ();
      this.isLoading = false;
      await this.getAudits ();
    } catch (e) {
      this.isLoading = false;
      // TODO - what do we do with errors?
      this.error = e;
    }
  }

  async getAudits () {
    try {
      this.audits = await this.auditService.getAudits (
        constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_ADMIN
      );
      if (this.audits && this.audits[0]) {
        this.auditedUser = (await this.usersService.getUserNameById (
          this.audits[0].updated_by
        )) || {};
      }
    } catch (e) {
      // TODO - what do we do with errors
      console.warn (e.stack);
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
   * For displaying entered count (for former event)
   * @returns {Promise<void>}
   */
  async getGroupsFormerEventTickets () {
    try {
      const tickets = await this.groupService.getAllCampsMembersTickets (
        this.groups.map (g => g.id),
        this.eventsService.getFormerEventId ()
      );
      if (!tickets || !Object.keys (tickets).length) {
        return;
      } else {
        for (const group of this.groups) {
          group.former_tickets = tickets[group.id];
        }
      }
    } catch (e) {
      // TODO - what do we do with errors?
      console.warn (e);
    }
  }

  async getGroupsAllocations () {
    try {
      this.allocations = (await this.allocationsService.getGroupsAllocations ([
        this.groups.map (g => g.id),
      ])).allocations || [];
    } catch (e) {
      console.warn (e);
    }
  }

  async getAdminAllocations () {
    const {match} = this.props;
    try {
      this.groupQuotas = (await this.allocationsService.getAdminsAllocations (
        constants.ALLOCATION_TYPES.PRE_SALE,
        this.parsingService.getGroupTypeFromString (match.params.groupType)
      )) || [];
    } catch (e) {
      console.warn (e);
    }
  }

  saveChanges = async () => {
    const {match} = this.props;
    try {
      if (
        !this.groupQuotas ||
        !this.groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY]
      ) {
        return;
      }
      await this.allocationsService.publishAdminsAllocations (
        constants.ALLOCATION_TYPES.PRE_SALE,
        this.parsingService.getGroupTypeFromString (match.params.groupType)
      );
      await this.auditService.setAudit (
        constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_ADMIN
      );
      await this.getAudits ();
      await this.getAdminAllocations ();
    } catch (e) {
      console.warn (`Error saving presale quota! - ${e.stack}`);
    }
  };

  get TRANSLATE_PREFIX () {
    const {match} = this.props;
    return `${match.params.groupType}:management`;
  }

  presaleQuotaChanged = async (group, quota) => {
    const {match} = this.props;
    // Set locally to update view
    const allocation = this.allocationsService.buildAdminAllocation (
      constants.ALLOCATION_TYPES.PRE_SALE,
      group.id,
      quota,
      this.parsingService.getGroupTypeFromString (match.params.groupType)
    );
    this.setGroupQuota (group, allocation);
    try {
      // Send data to server
      await this.allocationsService.addAllocationsToGroup (
        constants.ALLOCATION_TYPES.PRE_SALE,
        group.id,
        quota,
        this.parsingService.getGroupTypeFromString (match.params.groupType)
      );
    } catch (e) {
      console.warn (e.stack);
    }
  };

  setGroupQuota (group, allocation) {
    if (
      !this.groupQuotas ||
      !this.groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY]
    ) {
      return;
    }
    let groupQuotaIndex = this.groupQuotas[
      constants.UNPUBLISHED_ALLOCATION_KEY
    ].findIndex (adminAllocation => adminAllocation.group_id === group.id);
    if (groupQuotaIndex === -1) {
      this.groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY].push (allocation);
    } else {
      this.groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY][
        groupQuotaIndex
      ] = allocation;
    }
    return (this.groupQuotas = {...this.groupQuotas});
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
    const {t} = this.props;
    return (
      <div className="DGSAdmin">
        <Row>
          <Col lg="8" xl="7">
            <h1 className="h1-responsive headerText">
              <span>{t (`${this.TRANSLATE_PREFIX}.allocations.header`)}</span>
              {' '}
              <span className="text-blue">
                {t (`${this.TRANSLATE_PREFIX}.allocations.headerLink`)}
              </span>
            </h1>
            <p className="headerDescription p-1">
              <span className="subheaderText">
                {t (`${this.TRANSLATE_PREFIX}.allocations.subheader`)}
                {' '}
                (
                {this.eventsService.getFormerEventId ()}
                )
              </span>
              <span>
                {t (`${this.TRANSLATE_PREFIX}.allocations.description`)}
              </span>
            </p>
          </Col>
          <Col lg="4" xl="5">
            <BarChartCard t={t} translatePrefix={this.TRANSLATE_PREFIX} />
          </Col>
        </Row>

        <Row className="mt-4 mb-4">
          <Col md="6">
            <SearchInput
              value={this.query}
              onChange={this.handleChange}
              placeholder={t (`search`)}
            />
          </Col>
          <PermissableComponent permitted={!!this.lastAudit}>
            <Col md="6" className="text-gray d-flex align-items-center">
              <span>{t (`lastUpdate`)}: </span>
              <Moment className="pl-2 pr-2" format={'DD/MM/YYYY, HH:mm:ss'}>
                {this.lastAudit}
              </Moment>
              <span className="pl-2 pr-2">{t ('by')}: </span>
              <span>{this.auditedUser.name}</span>
            </Col>
          </PermissableComponent>
        </Row>
        <Row>
          <Col md="12">
            <GroupsTable
              isLoading={this.isLoading}
              publishQuota={this.saveChanges}
              allocations={this.allocations}
              groupQuotas={this.groupQuotas}
              presale={true}
              groups={(this.groups || []).filter (this.filter)}
              presaleQuotaChanged={this.presaleQuotaChanged}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export const PresaleAdmin = withRouter (withI18n () (BasePresaleAdmin));
