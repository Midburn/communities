import React from 'react';
import {withI18n} from 'react-i18next';
import {withRouter} from 'react-router-dom';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Row, Col} from 'mdbreact';
import {GroupsService} from '../../services/groups';
import {EventsService} from '../../services/events';
import {GroupMembers} from '../groups/Edit/GroupMembers';
import {AllocationService} from '../../services/allocations';
import Moment from 'react-moment';
import {UsersService} from '../../services/users';
import {AuditService} from '../../services/audit';
import * as constants from '../../../models/constants';
import {PermissableComponent} from '../controls/PermissableComponent';
import {EventRulesService} from '../../services/event-rules';
import {PermissionService} from '../../services/permissions';
import {DoughnutCard} from '../controls/DoughnutCard';
import {isMobileOnly} from 'react-device-detect';
import {SearchInput} from '../controls/SearchInput';
import {action} from 'mobx/lib/mobx';

@observer class BaseDGSGroupLeader extends React.Component {
  groupService = new GroupsService ();
  eventsService = new EventsService ();
  allocationsService = new AllocationService ();
  auditService = new AuditService ();
  usersService = new UsersService ();
  eventRules = new EventRulesService ();
  permissionsService = new PermissionService ();
  @observable query = '';
  @observable error;
  @observable group = {};
  @observable tickets = [];
  @observable allocations = [];
  @observable auditedUser = [];

  @observable isLoading = true;
  @observable quota = 0;

  get lastAudit () {
    if (!this.audits || !this.audits[0]) {
      return null;
    }
    return this.audits[0].createdAt;
  }

  constructor (props) {
    super (props);
    this.checkPermissions (props);
    this.getGroupData (props);
  }

  checkPermissions (props) {
    const {match} = props;
    if (!this.permissionsService.isAllowedToAllocateTickets (match.params.id)) {
      this.permissionsService.redirectToSpark ();
    }
  }

  componentWillReceiveProps (props) {
    this.getGroupData (props);
  }

  async getGroupData (props) {
    this.isLoading = true;
    const {match} = props;
    try {
      const group = await this.groupService.getGroup (match.params.id);
      if (!group) {
        // TODO - 404 group not found
        return;
      }
      this.group = group;
      try {
        const tickets = await this.groupService.getCampsMembersTickets (
          group.id
        );
        if (!tickets || !tickets.length) {
          this.tickets = [];
        } else {
          this.tickets = tickets;
        }
      } catch (e) {
        console.warn (e.stack);
        // TODO - what do we do with errors?
        this.tickets = [];
      }
      await this.getGroupAllocations ();
      await this.getAudits ();
      await this.getGroupsAllocationAndBuckets ();
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      console.warn (e.stack);
      this.error = e;
    }
  }

  allocationsChanged = async () => {
    try {
      await this.getGroupAllocations ();
      await this.auditService.setAudit (
        constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_GROUP,
        {related_entity: this.group.id}
      );
      await this.getAudits ();
    } catch (e) {
      console.warn (e.stack);
    }
  };

  async getAudits () {
    try {
      this.audits = await this.auditService.getAuditsForEntity (
        constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_GROUP,
        this.group.id
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

  getGroupAllocations = async () => {
    try {
      this.allocations = (await this.allocationsService.getMembersAllocations ([
        this.group.members.map (member => member.user_id),
      ])) || [];
    } catch (e) {
      console.warn (e);
    }
  };

  async getGroupsAllocationAndBuckets () {
    const response = await this.allocationsService.getGroupsAllocations ([
      this.group.id,
    ]);
    if (!response.buckets) {
      return;
    }
    this.quota = response.buckets
      .filter (
        bucket => bucket.allocation_type === constants.ALLOCATION_TYPES.PRE_SALE
      )
      .reduce ((result, value) => {
        result += +value.count;
        return result;
      }, 0);
  }

  get TRANSLATE_PREFIX () {
    const {match} = this.props;
    return `${match.params.groupType}:groupLeader`;
  }

  getMemberAllocationId = (memberId, allocationType, bool) => {
    const allocations = this.allocations;
    if (!allocations) {
      return false;
    }
    const allocation = allocations.find (
      allocation =>
        allocation.allocated_to === memberId &&
        allocationType === allocation.allocation_type
    );
    if (bool) {
      return !!allocation;
    }
    return allocation ? allocation.id : null;
  };

  isAllocatedByDifferentGroup (memberId, allocationType, returnType) {
    const group = this.group, allocations = this.allocations;
    if (!allocations) {
      return false;
    }
    const allocation = allocations.find (
      allocation =>
        allocation.allocated_to === memberId &&
        allocationType === allocation.allocation_type
    );
    if (!allocation || allocation.related_group === group.id) {
      return false;
    }
    return returnType
      ? allocation.allocation_group
      : allocation.related_group !== group.id;
  }

  get chartData () {
    const {t} = this.props;
    let totalAllocated = 0;
    for (const member of this.group.members || []) {
      totalAllocated += this.getMemberAllocationId (
        member.user_id,
        constants.ALLOCATION_TYPES.PRE_SALE,
        true
      ) &&
        !this.isAllocatedByDifferentGroup (
          member.user_id,
          constants.ALLOCATION_TYPES.PRE_SALE
        )
        ? 1
        : 0;
    }
    return [
      {
        label: t (`${this.TRANSLATE_PREFIX}.charts.allocationsUsed`),
        value: totalAllocated,
      },
      {
        label: t (`${this.TRANSLATE_PREFIX}.charts.allocationsLeft`),
        value: this.quota - totalAllocated,
        focus: true,
      },
    ];
  }

  /**
     *  Filter related methods (change, filter, match)
     */
  @action handleChange = e => {
    this.query = e.target.value;
  };

  match (member) {
    const name = member.name || '';
    const email = member.email || '';
    const phone = member.cell_phone || '';
    return (
      name.toLowerCase ().includes (this.query) ||
      email.toLowerCase ().includes (this.query) ||
      phone.toLowerCase ().includes (this.query)
    );
  }

  filter = member => {
    if (!this.query || !this.query.length) {
      // No query given - should return all camps
      return true;
    }
    return this.match (member);
  };

  render () {
    const {t, match, lng} = this.props;
    const AllocationLastDate = (
      <div>
        <span>{t (`allocationsLastDate`)}: </span>
        <Moment className="pl-2 pr-2" format={'DD/MM/YYYY, HH:mm:ss'}>
          {this.eventRules.lastDateToAllocatePreSale}
        </Moment>
      </div>
    );
    return (
      <div>
        <Row>
          <Col md="6">
            <h1 className="h1-responsive">
              {t (`${this.TRANSLATE_PREFIX}.header`)}
              {' '}
              -
              {' '}
              {this.groupService.getPropertyByLang (this.group, 'name', lng)}
            </h1>
          </Col>
          <Col md="6">
            <PermissableComponent permitted={!isMobileOnly}>
              <DoughnutCard data={this.chartData} note={AllocationLastDate} />
            </PermissableComponent>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <p className="p-1">
              {t (`${this.TRANSLATE_PREFIX}.description`)}
              {' '}
              (
              {this.eventsService.getFormerEventId ()}
              )
            </p>
          </Col>
        </Row>

        <Row className="mt-4 mb-4">
          <Col md="6">
            <SearchInput
              value={this.query}
              onChange={this.handleChange}
              placeholder={t (`members.search`)}
            />
          </Col>
          <Col md="6">
            <PermissableComponent permitted={this.lastAudit}>
              <span>{t (`lastUpdate`)}: </span>
              <Moment className="pl-2 pr-2" format={'DD/MM/YYYY, HH:mm:ss'}>
                {this.lastAudit}
              </Moment>
              <span className="pl-2 pr-2">{t ('by')}: </span>
              <span>{this.auditedUser.name}</span>
            </PermissableComponent>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <GroupMembers
              isLoading={this.isLoading}
              quota={this.quota}
              permissionsChanged={this.getGroupPermissions}
              allocationsChanged={this.allocationsChanged}
              allocations={this.allocations}
              group={this.group}
              presale={true}
              ticketCount={true}
              match={match}
              tickets={this.tickets || []}
              members={(this.group.members || []).filter (this.filter)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export const PresaleGroupLeader = withRouter (withI18n () (BaseDGSGroupLeader));
