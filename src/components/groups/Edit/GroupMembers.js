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
import {state} from '../../../models/state';
import {PermissionService} from '../../../services/permissions';
import {isMobileOnly} from 'react-device-detect';
import {Loader} from '../../Loader';

@observer class BaseGroupMembers extends React.Component {
  allocationsService = new AllocationService ();
  parsingService = new ParsingService ();
  permissionsService = new PermissionService ();
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

  getMemberPermission (memberId, permissionType) {
    const {permissions} = this.props;
    if (!permissions) {
      return;
    }
    return permissions.some (
      permission =>
        permission.permission_type === permissionType &&
        permission.user_id === memberId
    );
  }

  async changeMemberPermission (memberId, permissionType) {
    const {permissions, permissionsChanged} = this.props;
    if (!permissions) {
      return;
    }
    const permission = permissions.find (p => {
      return p.permission_type === permissionType && p.user_id === memberId;
    });
    if (!permission) {
      await this.addPermission (memberId, permissionType);
    } else {
      await this.removePermission (permission);
    }
    permissionsChanged ();
  }

  async addPermission (memberId, permissionType) {
    const {group} = this.props;
    try {
      await this.permissionsService.addPermission ({
        user_id: memberId,
        permission_type: permissionType,
        entity_type: constants.ENTITY_TYPE.GROUP,
        related_entity: group.id,
        permitted_by: state.loggedUser.user_id,
      });
    } catch (e) {
      console.warn (e);
    }
  }

  async removePermission (permission) {
    const {group} = this.props;
    try {
      await this.permissionsService.revokePermission (
        permission.id,
        constants.ENTITY_TYPE.GROUP,
        group.id
      );
    } catch (e) {
      console.warn (e);
    }
  }

  get tableSums () {
    const {t, members, presale, group} = this.props;
    let allPurchasedTicketsCount = 0, totalAllocated = 0;
    if (presale) {
      for (const member of members) {
        allPurchasedTicketsCount +=
          this.getMemberTicketCount (member.user_id) || 0;
        // allTransfferedTicketsCount += this.getMemberTransfferedTicketCount(member.user_id) || 0;
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
      [t (`${this.TRANSLATE_PREFIX}.sums.members`)]: members.length,
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
    return members.map (member => {
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
            )]: this.getMemberPermission (member.user_id),
          }
        : {};
      return {...baseData, ...preSaleData};
    });
  }

  isChangePermissionsDisabled (memberId) {
    const {permissions, group} = this.props;
    if (memberId === group.main_contact) {
      // This is the camp manager - can't change his permissions.
      return true;
    }
    return (
      permissions &&
      !permissions.some (permission => {
        return (
          permission.permission_type ===
            constants.PERMISSION_TYPES.GIVE_PERMISSION &&
          permission.user_id === state.loggedUser.user_id
        );
      })
    );
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
            {members.map (member => {
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
                        disabled={this.isChangePermissionsDisabled (
                          member.user_id
                        )}
                        onChange={e =>
                          this.changeMemberPermission (
                            member.user_id,
                            constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET
                          )}
                        checked={this.getMemberPermission (
                          member.user_id,
                          constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET
                        )}
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
