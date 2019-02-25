import React from 'react';
import {withI18n} from 'react-i18next';
import {Table, TableHead, TableBody, MDBTooltip} from 'mdbreact';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {PermissableComponent} from '../../controls/PermissableComponent';
import {TableSummery} from '../../controls/TableSummery';
import {WarningModal} from '../../controls/WarningModal';
import * as constants from '../../../../models/constants';
import {AllocationService} from '../../../services/allocations';
import {ParsingService} from '../../../services/parsing';
import {isMobileOnly} from 'react-device-detect';
import {Loader} from '../../Loader';
import {GroupsService} from '../../../services/groups';

@observer class BaseGroupMembers extends React.Component {
  allocationsService = new AllocationService ();
  parsingService = new ParsingService ();
  groupService = new GroupsService ();
  TRANSLATE_PREFIX = `members`;

  @observable memberPermissions = {};

  @observable tickets = [];

  @observable allocationWarning = false;

  allocationTimeout = null;

  changeAllocation = async (memberId, allocationType, e) => {
    const {allocations, match, group, allocationsChanged, quota} = this.props;
    const allocated = allocations.filter (
      allocation => allocation.allocation_type === allocationType
    ).length;
    try {
      if (!!e.target.checked && quota <= allocated) {
        // There no more allocations
        if (this.allocationTimeout) {
          clearTimeout (this.allocationTimeout);
        }
        this.toggleAllocationWarning ();
        setTimeout (() => {
          if (this.allocationWarning) {
            this.toggleAllocationWarning ();
          }
        }, 5000);
        return;
      }
      const allocationId = this.getMemberAllocationId (
        memberId,
        allocationType
      );
      if (allocationId || allocationId === 0) {
        // User is already allocated!
        await this.allocationsService.removeAllocation (group.id, allocationId);
      } else {
        await this.allocationsService.allocate (
          allocationType,
          memberId,
          group.id,
          this.parsingService.getGroupTypeFromString (match.params.groupType)
        );
      }
      allocationsChanged ();
    } catch (e) {
      console.log (e.stack);
    }
  };

  getMemberAllocationId = (memberId, allocationType, bool) => {
    const {allocations} = this.props;
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
    const {group, allocations} = this.props;
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

  getMemberAllocationTooltip (memberId, allocationType) {
    const {t} = this.props;
    const isAllocatedByOtherGroup = this.isAllocatedByDifferentGroup (
      memberId,
      allocationType,
      true
    );
    return isAllocatedByOtherGroup
      ? t (`${this.TRANSLATE_PREFIX}.tooltips.allocatedByOtherGroup`, {
          groupType: t (isAllocatedByOtherGroup),
        })
      : t (`${this.TRANSLATE_PREFIX}.tooltips.allocate`);
  }

  getMemberTicketCount (memberId) {
    const {tickets} = this.props;
    if (!tickets) {
      return 0;
    }
    return tickets.filter (
      ticket => ticket.buyer_id === memberId || ticket.holder === memberId
    ).length;
  }

  getMemberTransfferedTicketCount (memberId) {
    const {tickets} = this.props;
    if (!tickets) {
      return;
    }
    return tickets.filter (
      ticket => ticket.buyer_id === memberId && ticket.holder_id !== memberId
    ).length;
  }

  async changeMemberRole (memberId, role) {
    if (!constants.GROUP_STATIC_ROLES[role]) {
      throw new Error (
        'Role which give action rights must come from static constants'
      );
    }
    if (!this.memberHasRole (memberId, role)) {
      await this.addMemberRole (memberId, role);
    } else {
      await this.removeMemberRole (memberId, role);
    }
  }

  get tableSums () {
    const {t, members, presale} = this.props;
    let allPurchasedTicketsCount = 0, totalAllocated = 0;
    if (presale) {
      for (const member of members) {
        allPurchasedTicketsCount +=
          this.getMemberTicketCount (member.user_id) || 0;
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
    }
    const baseSums = {
      [t (`${this.TRANSLATE_PREFIX}.sums.members`)]: (members || []).length,
    };
    const preSaleSums = presale
      ? {
          [t (
            `${this.TRANSLATE_PREFIX}.sums.ticketsAll`
          )]: allPurchasedTicketsCount,
          // [t(`${this.TRANSLATE_PREFIX}.sums.ticketsTransferred`)]: allTransfferedTicketsCount,
          [t (`${this.TRANSLATE_PREFIX}.sums.allocated`)]: totalAllocated,
          [t (`${this.TRANSLATE_PREFIX}.sums.quota`)]: this.quota || 0,
        }
      : {};
    return {
      ...baseSums,
      ...preSaleSums,
    };
  }

  get CSVdata () {
    const {presale, t, members} = this.props;
    return (members || []).map (member => {
      const baseData = {
        [t (`${this.TRANSLATE_PREFIX}.columns.name`)]: member.name,
        [t (`${this.TRANSLATE_PREFIX}.columns.email`)]: member.email,
        [t (`${this.TRANSLATE_PREFIX}.columns.phone`)]: member.cell_phone,
      };
      const preSaleData = presale
        ? {
            [t (
              `${this.TRANSLATE_PREFIX}.columns.tickets`
            )]: this.getMemberTicketCount (member.user_id),
            // [t(`${this.TRANSLATE_PREFIX}.columns.ticketsTransferred`)]: this.getMemberTransfferedTicketCount(member.user_id),
            [t (
              `${this.TRANSLATE_PREFIX}.columns.presale`
            )]: this.getMemberAllocationId (
              member.user_id,
              constants.ALLOCATION_TYPES.PRE_SALE,
              true
            ),
            [t (
              `${this.TRANSLATE_PREFIX}.columns.allowToAllocate`
            )]: this.canAllocatePresale (member.user_id),
          }
        : {};
      return {...baseData, ...preSaleData};
    });
  }

  memberHasRole (memberId, role) {
    const {group} = this.props;
    return (
      group.roles &&
      group.roles.some (r => memberId === r.user_id && r.role === role)
    );
  }

  isChangeRoleDisabled (memberId) {
    if (this.memberHasRole (memberId, constants.GROUP_STATIC_ROLES.LEADER)) {
      // cant change leader roles
      return true;
    }
  }

  canAllocatePresale (memberId) {
    return (
      this.memberHasRole (memberId, constants.GROUP_STATIC_ROLES.LEADER) ||
      this.memberHasRole (
        memberId,
        constants.GROUP_STATIC_ROLES.PRE_SALE_ALLOCATOR
      )
    );
  }

  async addMemberRole (memberId, role) {
    const {group} = this.props;
    try {
      await this.groupService.changeUserRole (
        group.id,
        memberId,
        role,
        constants.ACTION_NAMES.ADD
      );
      group.roles.push ({
        group_id: group.id,
        user_id: memberId,
        role,
      });
    } catch (e) {
      console.warn (e.stack);
    }
  }

  async removeMemberRole (memberId, role) {
    const {group} = this.props;
    try {
      await this.groupService.changeUserRole (
        group.id,
        memberId,
        role,
        constants.ACTION_NAMES.DELETE
      );
      group.roles = group.roles.filter (
        r => !(r.user_id === memberId && r.role === role)
      );
    } catch (e) {
      console.warn (e.stack);
    }
  }

  toggleAllocationWarning = () => {
    this.allocationWarning = !this.allocationWarning;
  };

  render () {
    const {t, members, presale, ticketCount, isLoading} = this.props;
    if (isLoading) {
      return <Loader />;
    }
    return (
      <div>
        <WarningModal
          isOpen={this.allocationWarning}
          title={t (`${this.TRANSLATE_PREFIX}.allocationWarning.title`)}
          toggle={this.toggleAllocationWarning}
          text={t (`${this.TRANSLATE_PREFIX}.allocationWarning.text`)}
        />
        <PermissableComponent permitted={!isMobileOnly}>
          <TableSummery
            csvName={`GroupMembersSummery - ${new Date ().toDateString ()}.csv`}
            sums={this.tableSums}
            csvData={this.CSVdata}
          />
        </PermissableComponent>
        <Table responsive btn>
          <TableHead>
            <tr>
              <th>{t (`${this.TRANSLATE_PREFIX}.columns.name`)}</th>
              <th>{t (`${this.TRANSLATE_PREFIX}.columns.email`)}</th>
              <th>{t (`${this.TRANSLATE_PREFIX}.columns.phone`)}</th>
              <PermissableComponent permitted={presale}>
                <th>{t (`${this.TRANSLATE_PREFIX}.columns.tickets`)}</th>
              </PermissableComponent>
              {/*<PermissableComponent permitted={presale}>*/}
              {/*<th>{t(`${this.TRANSLATE_PREFIX}.columns.ticketsTransferred`)}</th>*/}
              {/*</PermissableComponent>*/}
              <PermissableComponent permitted={presale}>
                <th>{t (`${this.TRANSLATE_PREFIX}.columns.presale`)}</th>
              </PermissableComponent>
              <PermissableComponent permitted={presale}>
                <th>
                  {t (`${this.TRANSLATE_PREFIX}.columns.allowToAllocate`)}
                </th>
              </PermissableComponent>
            </tr>
          </TableHead>
          <TableBody>
            {(members || []).map (member => {
              return (
                <tr key={member.user_id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.cell_phone}</td>
                  <PermissableComponent permitted={ticketCount}>
                    <td>
                      {this.getMemberTicketCount (member.user_id)}
                    </td>
                  </PermissableComponent>
                  {/*<PermissableComponent permitted={ticketCount}>*/}
                  {/*<td>*/}
                  {/*{this.getMemberTransfferedTicketCount(member.user_id)}*/}
                  {/*</td>*/}
                  {/*</PermissableComponent>*/}
                  <PermissableComponent permitted={!!presale}>
                    <td>
                      <MDBTooltip
                        placement="top"
                        className="d-flex justify-content-center"
                        tooltipContent={this.getMemberAllocationTooltip (
                          member.user_id,
                          constants.ALLOCATION_TYPES.PRE_SALE
                        )}
                      >
                        <input
                          onChange={e =>
                            this.changeAllocation (
                              member.user_id,
                              constants.ALLOCATION_TYPES.PRE_SALE,
                              e
                            )}
                          disabled={this.isAllocatedByDifferentGroup (
                            member.user_id,
                            constants.ALLOCATION_TYPES.PRE_SALE
                          )}
                          checked={this.getMemberAllocationId (
                            member.user_id,
                            constants.ALLOCATION_TYPES.PRE_SALE,
                            true
                          )}
                          type="checkbox"
                        />
                      </MDBTooltip>
                    </td>
                  </PermissableComponent>
                  <PermissableComponent permitted={presale}>
                    <td className="d-flex justify-content-center">
                      <input
                        disabled={this.isChangeRoleDisabled (member.user_id)}
                        onChange={e =>
                          this.changeMemberRole (
                            member.user_id,
                            constants.GROUP_STATIC_ROLES.PRE_SALE_ALLOCATOR
                          )}
                        checked={this.canAllocatePresale (member.user_id)}
                        type="checkbox"
                      />
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

export const GroupMembers = withI18n () (BaseGroupMembers);
