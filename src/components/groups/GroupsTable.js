import React from 'react';
import { withI18n } from 'react-i18next';
import { NavLink, withRouter } from 'react-router-dom';
import { Table, TableHead, TableBody } from 'mdbreact';
import { GroupsService } from '../../services/groups';
import { TableSummery } from '../controls/TableSummery';
import { PermissableComponent } from '../controls/PermissableComponent';
import * as constants from '../../../models/constants';
import {isMobileOnly } from 'react-device-detect';
import {NumberEditor} from "../controls/NumberEditor";

class BaseGroupsTable extends React.Component {

    groupsService = new GroupsService();

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:management`;
    }

    updateGroupsQuota(group, quota) {
        this.props.presaleQuotaChanged(group, quota);
    }

    getFormerEventEntries(group) {
        if (!group || !group.former_tickets || !group.former_tickets.length) {
            return 0;
        }
        return group.former_tickets.filter(ticket => !!ticket.entrance_timestamp || !!ticket.first_entrance_timestamp).length;
    }

    get tableSums() {
        const {t, groups, presale} = this.props;
        let membersSum = 0, ticketsSum = 0, allocatedSum = 0;
        for (const group of groups) {
            membersSum += group.members_count || 0;
            ticketsSum += (group.tickets || []).length;
            allocatedSum += +group.pre_sale_tickets_quota || 0;
        }
        const baseSums = {
            [t(`${this.TRANSLATE_PREFIX}.sums.groups`)]: groups.length,
            [t(`${this.TRANSLATE_PREFIX}.sums.members`)]: membersSum,
            [t(`${this.TRANSLATE_PREFIX}.sums.ticketsAll`)]: ticketsSum,
        };
        const presaleSums = presale ? {
            [t(`${this.TRANSLATE_PREFIX}.sums.allocated`)]: allocatedSum
        } : {};
        return {
            ...baseSums,
            ...presaleSums
        }
    }


    get CSVdata() {
        const {t, groups, presale} = this.props;
        return groups.map(g => {
            const baseData = {
                [t(`${this.TRANSLATE_PREFIX}.table.groupName`)]: this.groupsService.getPropertyByLang(g, 'name'),
                [t(`${this.TRANSLATE_PREFIX}.table.leaderName`)]: g.contact_person_name,
                [t(`${this.TRANSLATE_PREFIX}.table.leaderEmail`)]: g.contact_person_email,
                [t(`${this.TRANSLATE_PREFIX}.table.leaderPhone`)]: g.contact_person_phone,
                [t(`${this.TRANSLATE_PREFIX}.table.totalMembers`)]: g.members_count,
                [t(`${this.TRANSLATE_PREFIX}.table.totalPurchased`)]: (g.tickets || []).length
            };
            const presaleData = presale ? {
                [t(`${this.TRANSLATE_PREFIX}.table.totalEntered`)]: this.getFormerEventEntries(g),
                [t(`${this.TRANSLATE_PREFIX}.table.quota`)]: g.quota || 0,
                [t(`${this.TRANSLATE_PREFIX}.table.allocated`)]: this.getGroupAllocatedCount(g, constants.ALLOCATION_TYPES.PRE_SALE)
            } : {};
            return {
                ...baseData,
                ...presaleData

            };
        })
    }

    getGroupPendingAllocations(group) {
        const {groupQuotas} = this.props;
        if (!groupQuotas || !groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY]) {
            return 0;
        }
        const groupQuota = groupQuotas[constants.UNPUBLISHED_ALLOCATION_KEY].find(adminAllocation => adminAllocation.group_id === group.id);
        if (!groupQuota) {
            return 0;
        }
        return groupQuota.count;
    }

    getGroupAllocatedCount(group, allocationType) {
        const {allocations} = this.props;
        if (!allocations) {
            return '';
        }
        return allocations.filter(allocation => allocation.related_group === group.id && allocation.allocation_type === allocationType).length;
    }

    render() {
        const {t, groups, presale, groupQuotas} = this.props;
        return (
            <div>
                <PermissableComponent permitted={!isMobileOnly}>
                    <TableSummery csvName={`GroupsAllocationSummery - ${(new Date()).toDateString()}.csv`}
                                  sums={this.tableSums} csvData={this.CSVdata}/>
                </PermissableComponent>
                <Table hover responsive btn className="GroupsTable">
                    <TableHead>
                        <tr>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.groupName`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.leaderName`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.leaderEmail`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.leaderPhone`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.totalMembers`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.totalPurchased`)}</th>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.table.totalEntered`)}</th>
                            </PermissableComponent>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.table.quota`)}</th>
                            </PermissableComponent>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.table.allocated`)}</th>
                            </PermissableComponent>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {groups.map(g => {
                            return (
                                <tr key={g.id}>
                                    <td>
                                        <NavLink
                                            to={`${g.id}`}>{this.groupsService.getPropertyByLang(g, 'name')}</NavLink>
                                    </td>
                                    <td>
                                        {g.contact_person_name}
                                    </td>
                                    <td>
                                        {g.contact_person_email}
                                    </td>
                                    <td>
                                        {g.contact_person_phone}
                                    </td>
                                    <td>
                                        {g.members_count}
                                    </td>
                                    <td>
                                        {(g.tickets || []).length}
                                    </td>
                                    <PermissableComponent permitted={presale}>
                                        <td>
                                            {this.getFormerEventEntries(g)}
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={presale && groupQuotas}>
                                        <td>
                                            <NumberEditor value={this.getGroupPendingAllocations(g)} min={0} onChange={(e) => this.updateGroupsQuota(g, e)}/>
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={presale}>
                                        <td>
                                            {this.getGroupAllocatedCount(g, constants.ALLOCATION_TYPES.PRE_SALE)}
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

export const GroupsTable = withRouter(withI18n()(BaseGroupsTable));
