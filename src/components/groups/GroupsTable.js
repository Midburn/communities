import React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {Table, TableHead, TableBody, MDBBtn} from 'mdbreact';
import {GroupsService} from '../../services/groups';
import {EventsService} from '../../services/events';
import {TableSummery} from '../controls/TableSummery';
import {PermissableComponent} from '../controls/PermissableComponent';
import * as constants from '../../../models/constants';
import {isMobileOnly} from 'react-device-detect';
import {NumberEditor} from '../controls/NumberEditor';
import {FiCheckCircle, FiPhone} from 'react-icons/fi';
import {withI18n} from 'react-i18next';
import {DataHoverCard} from '../controls/DataHoverCard';
import {MdMailOutline} from 'react-icons/md';
import {Loader} from '../Loader';

class BaseGroupsTable extends React.Component {
  groupsService = new GroupsService ();
  eventsService = new EventsService ();

  get TRANSLATE_PREFIX () {
    const {match} = this.props;
    return `${match.params.groupType}:management`;
  }

  updateGroupsQuota (group, quota) {
    this.props.presaleQuotaChanged (group, quota);
  }

  getFormerEventEntries (group) {
    if (!group || !group.former_tickets) {
      return 0;
    }
    return group.former_tickets.length || 0;
  }

  get tableSums () {
    const {t, groups} = this.props;
    let membersSum = 0;
    for (const group of groups) {
      membersSum += (group.members || []).length || 0;
    }
    return {
      [t (`${this.TRANSLATE_PREFIX}.sums.groups`)]: groups.length,
      [t (`${this.TRANSLATE_PREFIX}.sums.members`)]: membersSum,
    };
  }

  get CSVdata () {
    const {t, groups, presale, lng} = this.props;
    return groups.map (g => {
      const baseData = {
        [t (
          `${this.TRANSLATE_PREFIX}.table.groupName`
        )]: this.groupsService.getPropertyByLang (g, 'name', lng),
        [t (`${this.TRANSLATE_PREFIX}.table.leaderName`)]: this.getManagerProp (
          g,
          'name'
        ),
        [t (
          `${this.TRANSLATE_PREFIX}.table.leaderEmail`
        )]: this.getManagerProp (g, 'email'),
        [t (
          `${this.TRANSLATE_PREFIX}.table.leaderPhone`
        )]: this.getManagerProp (g, 'cell_phone'),
        [t (`${this.TRANSLATE_PREFIX}.table.totalMembers`)]: (g.members || [])
          .length,
        [t (`${this.TRANSLATE_PREFIX}.table.totalPurchased`)]: (g.tickets || [])
          .length,
      };
      const presaleData = presale
        ? {
            [t (
              `${this.TRANSLATE_PREFIX}.table.totalEntered`
            )]: this.getFormerEventEntries (g),
            [t (`${this.TRANSLATE_PREFIX}.table.quota`)]: g.quota || 0,
            [t (
              `${this.TRANSLATE_PREFIX}.table.allocated`
            )]: this.getGroupTotalAllocated (
              g,
              constants.ALLOCATION_TYPES.PRE_SALE
            ),
          }
        : {};
      return {
        ...baseData,
        ...presaleData,
      };
    });
  }

  getGroupQuota (group, key) {
    const {groupQuotas} = this.props;
    if (
      !groupQuotas ||
      !groupQuotas[key || constants.UNPUBLISHED_ALLOCATION_KEY]
    ) {
      return 0;
    }
    const groupQuota = groupQuotas[
      key || constants.UNPUBLISHED_ALLOCATION_KEY
    ].find (adminAllocation => adminAllocation.group_id === group.id);
    if (!groupQuota) {
      return 0;
    }
    return groupQuota.count;
  }

  getTotalUnpublishedAllocations () {
    const {groupQuotas} = this.props;
    return groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY]
      ? groupQuotas[
          constants.UNPUBLISHED_ALLOCATION_KEY
        ].reduce ((result, value) => {
          result += +value.count || 0;
          return result;
        }, 0)
      : 0;
  }

  getGroupsBucketCount (group) {
    const {groupQuotas} = this.props;
    if (!groupQuotas) {
      return 0;
    }
    return groupQuotas[group.id]
      ? groupQuotas[group.id].reduce ((result, value) => {
          result += +value.count || 0;
          return result;
        }, 0)
      : 0;
  }

  getGroupTotalAllocated (group, allocationType) {
    const {allocations} = this.props;
    if (!allocations) {
      return '';
    }
    return allocations.filter (
      allocation =>
        allocation.related_group === group.id &&
        allocation.allocation_type === allocationType
    ).length;
  }

  /**
   * Methods relevant to getting manager details
   */
  getManagerProp (group, propName) {
    if (!group || !group.members) {
      return ' ';
    }

    const managerId = (group.roles.find(member => member.role === constants.GROUP_STATIC_ROLES.LEADER) || {}).user_id;
    if (!managerId) {
      return ' ';
    }
    const manager = group.members.find (
      member => member.user_id === managerId
    );
    if (manager) {
      return manager[propName];
    } else {
      return '';
    }
  }

  getManagerExtraDetails (group) {
    return (
      <div>
        <div className="d-flex align-items-center">
          <FiPhone />
          <span className="ml-2 mr-2">
            {this.getManagerProp (group, 'cell_phone')}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <MdMailOutline />
          <span className="ml-2 mr-2">
            {this.getManagerProp (group, 'email')}
          </span>
        </div>
      </div>
    );
  }

  render () {
    const {
      t,
      groups,
      isLoading,
      presale,
      groupQuotas,
      publishQuota,
      lng,
    } = this.props;
    if (isLoading) {
      return <Loader />;
    }
    const PublishButton = presale
      ? <MDBBtn className="blue" onClick={publishQuota}>
          <FiCheckCircle />
          {t (`${this.TRANSLATE_PREFIX}.table.publish`, {
            allocationsCount: this.getTotalUnpublishedAllocations (),
          })}
        </MDBBtn>
      : null;
    return (
      <div>
        <PermissableComponent permitted={!isMobileOnly}>
          <TableSummery
            csvName={`GroupsAllocationSummery - ${new Date ().toDateString ()}.csv`}
            moreButtons={PublishButton}
            sums={this.tableSums}
            csvData={this.CSVdata}
          />
        </PermissableComponent>
        <Table hover responsive btn className="GroupsTable">
          <TableHead>
            <tr>
              <th>{t (`${this.TRANSLATE_PREFIX}.table.groupName`)}</th>
              <th>{t (`${this.TRANSLATE_PREFIX}.table.leaderName`)}</th>
              <th>
                <span className="pl-1 pr-1">
                  {t (`${this.TRANSLATE_PREFIX}.table.totalMembers`)}
                </span>
                <PermissableComponent permitted={presale}>
                  (
                  {this.eventsService
                    .getFormerEventId ()
                    .replace ('MIDBURN', '')}
                  )
                </PermissableComponent>
              </th>
              <PermissableComponent permitted={presale}>
                <th>
                  <span className="pl-1 pr-1">
                    {t (`${this.TRANSLATE_PREFIX}.table.totalEntered`)}
                  </span>{' '}
                  (
                  {this.eventsService
                    .getFormerEventId ()
                    .replace ('MIDBURN', '')}
                  )
                </th>
                <th>{t (`${this.TRANSLATE_PREFIX}.table.quota`)}</th>
                <th>{t (`${this.TRANSLATE_PREFIX}.table.bucket`)}</th>
                <th>{t (`${this.TRANSLATE_PREFIX}.table.allocated`)}</th>
              </PermissableComponent>
            </tr>
          </TableHead>
          <TableBody>
            {groups.map (g => {
              return (
                <tr key={g.id}>
                  <td>
                    <NavLink to={`${g.id}`}>
                      {this.groupsService.getPropertyByLang (g, 'name', lng)}
                    </NavLink>
                  </td>
                  <td>
                    <DataHoverCard
                      title={this.getManagerProp (g, 'name')}
                      panel={this.getManagerExtraDetails (g)}
                    />
                  </td>
                  <td>{(g.members || []).length}</td>
                  <PermissableComponent permitted={presale}>
                    <td>{this.getFormerEventEntries (g)}</td>
                  </PermissableComponent>
                  <PermissableComponent permitted={presale && groupQuotas}>
                    <td>
                      <NumberEditor
                        value={this.getGroupQuota (g)}
                        min={0}
                        onChange={e => this.updateGroupsQuota (g, e)}
                      />
                    </td>
                    <td>
                      {this.getGroupsBucketCount (
                        g,
                        constants.ALLOCATION_TYPES.PRE_SALE
                      )}
                    </td>
                    <td>
                      {this.getGroupTotalAllocated (
                        g,
                        constants.ALLOCATION_TYPES.PRE_SALE
                      )}
                    </td>
                  </PermissableComponent>
                </tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export const GroupsTable = withRouter (withI18n () (BaseGroupsTable));
