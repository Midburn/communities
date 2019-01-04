import React from 'react';
import { withI18n } from 'react-i18next';
import { Table, TableHead, TableBody, Input, MDBTooltip } from 'mdbreact';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PermissableComponent } from '../../controls/PermissableComponent';
import { TableSummery } from '../../controls/TableSummery';
import { WarningModal } from '../../controls/WarningModal';
import * as constants from '../../../../models/constants';
import { AllocationService } from '../../../services/allocations';
import { ParsingService } from '../../../services/parsing';
import { FloatingDashboard } from '../../controls/FloatingDashboard';

@observer
class BaseGroupMembers extends React.Component {

    allocationsService = new AllocationService();
    parsingService = new ParsingService();
    TRANSLATE_PREFIX = `members`;

    ALLOCATION_TYPE_TO_GROUP_QUOTA = {
        [constants.ALLOCATION_TYPES.PRE_SALE]: 'pre_sale_tickets_quota',
        [constants.ALLOCATION_TYPES.EARLY_ARRIVAL]: 'early_arrival_tickets_quota'
    };
    @observable
    query = '';

    @observable
    memberPermissions = {};

    @observable
    tickets = [];

    @observable
    allocationWarning = false;

    allocationTimeout = null;

    @action
    handleChange = (e) => {
        this.query = e.target.value;
    };

    filter = (member) => {
        if (!this.query || !this.query.length) {
            // No query given - should return all camps
            return true;
        }
        return this.match(member);
    };

    match(member) {
        const name = member.name || '';
        const email = member.email || '';
        const phone = member.cell_phone || '';
        return name.toLowerCase().includes(this.query) ||
            email.toLowerCase().includes(this.query) ||
            phone.toLowerCase().includes(this.query);
    }

    changeAllocation = async (memberId, allocationType, e) => {
        const {allocations, match, group, allocationsChanged} = this.props;
        const allocated = allocations.filter(allocation => allocation.allocation_type === allocationType).length;
        const quota = group[this.ALLOCATION_TYPE_TO_GROUP_QUOTA[allocationType]];
        try {
            if (!!e.target.checked && quota <= allocated) {
                // There no more allocations
                if (this.allocationTimeout) {
                    clearTimeout(this.allocationTimeout);
                }
                this.toggleAllocationWarning();
                setTimeout(() => {
                    if (this.allocationWarning) {
                        this.toggleAllocationWarning();
                    }
                }, 5000);
                return;
            }
            const allocationId = this.getMemberAllocationId(memberId, allocationType);
            if (allocationId || allocationId === 0) {
                // User is already allocated!
                await this.allocationsService.removeAllocation(allocationId);
            } else {
                await this.allocationsService.allocate(
                    allocationType,
                    memberId,
                    group.id,
                    this.parsingService.getGroupTypeFromString(match.params.groupType)
                );
            }
            allocationsChanged();
        } catch (e) {
            console.log(e.stack);
        }
    };

    getMemberAllocationId = (memberId, allocationType, bool) => {
        const {allocations} = this.props;
        if (!allocations) {
            return false;
        }
        const allocation = allocations.find(allocation => allocation.allocated_to === memberId && allocationType === allocation.allocation_type);
        if (bool) {
            return !!allocation;
        }
        return allocation ? allocation.id : null
    };

    isAllocatedByDifferentGroup(memberId, allocationType, returnType) {
        const {group, allocations} = this.props;
        if (!allocations) {
            return false;
        }
        const allocation = allocations.find(allocation => allocation.allocated_to === memberId && allocationType === allocation.allocation_type);
        if (!allocation || allocation.related_group === group.id) {
            return false;
        }
        return returnType ? allocation.allocation_group : allocation.related_group !== group.id;
    }

    getMemberAllocationTooltip(memberId, allocationType) {
        const {t} = this.props;
        const isAllocatedByOtherGroup = this.isAllocatedByDifferentGroup(memberId, allocationType, true);
        return  isAllocatedByOtherGroup ?
            t(`${this.TRANSLATE_PREFIX}.tooltips.allocatedByOtherGroup`, { groupType: t(isAllocatedByOtherGroup) }) :
            t(`${this.TRANSLATE_PREFIX}.tooltips.allocate`);
    };

    getMemberTicketCount(memberId) {
        const {tickets} = this.props;
        if (!tickets) {
            return 0;
        }
        return tickets.filter(ticket => ticket.buyer_id === memberId || ticket.holder === memberId).length;
    }

    isMemberHoldingTicket(memberId) {
        const {tickets} = this.props;
        if (!tickets) {
            return false;
        }
        return !!tickets.filter(ticket => ticket.holder === memberId);
    }

    getMemberTransfferedTicketCount(memberId) {
        const {tickets} = this.props;
        if (!tickets) {
            return;
        }
        return tickets.filter(ticket => ticket.buyer_id === memberId && ticket.holder_id !== memberId).length;
    }

    getMemberAllocationPermission(memberId) {
        if (!this.memberPermissions[memberId]) {
            return this.memberPermissions[memberId];
        }
        // TODO - replace
        return this.memberPermissions[memberId].includes('allocatePresale');
    }

    changeMembersAllocatingPermission(memberId, e) {
        // TODO - implement saving changes + permissions from DB.
        if (e.target.checked) {
            this.addPermission(memberId, 'allocatePresale');
        } else {
            this.removePermission(memberId, 'allocatePresale');
        }
    }

    addPermission(memberId, permission) {
        if (!this.memberPermissions[memberId]) {
            this.memberPermissions[memberId] = [permission]
        } else {
            this.memberPermissions[memberId].push(permission);
        }
    }

    removePermission(memberId, permission) {
        if (!this.memberPermissions[memberId]) {
            return;
        }
        const index = this.memberPermissions[memberId].indexOf(permission);
        if (index > -1) {
            this.memberPermissions[memberId].splice(index, 1);
        }
    }

    get tableSums() {
        const {t, members, presale, group} = this.props;
        let allPurchasedTicketsCount = 0, allTransfferedTicketsCount = 0, totalAllocated = 0;
        if (presale) {
            for (const member of members) {
                allPurchasedTicketsCount += this.getMemberTicketCount(member.user_id) || 0;
                allTransfferedTicketsCount += this.getMemberTransfferedTicketCount(member.user_id) || 0;
                totalAllocated += this.getMemberAllocationId(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE, true)
                && !this.isAllocatedByDifferentGroup(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE)
                    ? 1 : 0;
            }
        }
        const baseSums = {
            [t(`${this.TRANSLATE_PREFIX}.sums.members`)]: members.length,
        };
        const preSaleSums = presale ? {
            [t(`${this.TRANSLATE_PREFIX}.sums.ticketsAll`)]: allPurchasedTicketsCount,
            [t(`${this.TRANSLATE_PREFIX}.sums.ticketsTransferred`)]: allTransfferedTicketsCount,
            [t(`${this.TRANSLATE_PREFIX}.sums.allocated`)]: totalAllocated,
            [t(`${this.TRANSLATE_PREFIX}.sums.quota`)]: group.pre_sale_tickets_quota || 0,
        } : {};
        return {
            ...baseSums,
            ...preSaleSums

        }
    }


    get CSVdata() {
        const {presale, t, members} = this.props;
        return members.map(member => {
            const baseData = {
                [t(`${this.TRANSLATE_PREFIX}.columns.name`)]: member.name,
                [t(`${this.TRANSLATE_PREFIX}.columns.email`)]: member.email,
                [t(`${this.TRANSLATE_PREFIX}.columns.phone`)]: member.cell_phone
            };
            const preSaleData = presale ? {
                [t(`${this.TRANSLATE_PREFIX}.columns.tickets`)]: this.getMemberTicketCount(member.user_id),
                [t(`${this.TRANSLATE_PREFIX}.columns.ticketsTransferred`)]: this.getMemberTransfferedTicketCount(member.user_id),
                [t(`${this.TRANSLATE_PREFIX}.columns.presale`)]: this.getMemberAllocationId(member.user_id,
                    constants.ALLOCATION_TYPES.PRE_SALE,
                    true),
                [t(`${this.TRANSLATE_PREFIX}.columns.allowToAllocate`)]: this.getMemberAllocationPermission(member.user_id)
            } : {};
            return {...baseData, ...preSaleData}
        })
    }

    get chartData() {
        const {t, group, presale, members, allocations} = this.props;
        if (!allocations) {
            return [];
        }
        let totalAllocated = 0, membersWithTickets = 0;
        if (presale) {
            for (const member of members) {
                totalAllocated += this.getMemberAllocationId(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE, true)
                && !this.isAllocatedByDifferentGroup(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE)
                    ? 1 : 0;
                membersWithTickets += this.isMemberHoldingTicket(member.user_id) ? 1 : 0;
            }
        }
        const totalAllocationsUsageChart = {
            title: t(`${this.TRANSLATE_PREFIX}.charts.allocationsUsage`),
            data: {
                labels: [
                    t(`${this.TRANSLATE_PREFIX}.charts.allocationsUsed`),
                    t(`${this.TRANSLATE_PREFIX}.charts.allocationsLeft`)
                ],
                datasets: [
                    {
                        data: [totalAllocated, group.pre_sale_tickets_quota - totalAllocated],
                        backgroundColor: [
                            "#F7464A",
                            "#949FB1",
                        ],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#A8B3C5",
                        ]
                    }
                ],
            }

        };
        const totalMembersWithTicketsChart = {
            title: t(`${this.TRANSLATE_PREFIX}.charts.membersTickets`),
            data: {
                labels: [
                    t(`${this.TRANSLATE_PREFIX}.charts.membersWithTickets`),
                    t(`${this.TRANSLATE_PREFIX}.charts.membersWithoutTickets`)
                ],
                datasets: [
                    {
                        data: [membersWithTickets, members.length - membersWithTickets],
                        backgroundColor: [
                            "#F7464A",
                            "#949FB1",
                        ],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#A8B3C5",
                        ]
                    }
                ],
            }

        };
        return [totalAllocationsUsageChart, totalMembersWithTicketsChart];
    }

    toggleAllocationWarning = () => {
        this.allocationWarning = !this.allocationWarning;
    }

    render() {
        const {t, members, presale, ticketCount} = this.props;
        return (
            <div>
                <WarningModal
                    isOpen={this.allocationWarning}
                    title={t(`${this.TRANSLATE_PREFIX}.allocationWarning.title`)}
                    toggle={this.toggleAllocationWarning}
                    text={t(`${this.TRANSLATE_PREFIX}.allocationWarning.text`)}/>
                <PermissableComponent permitted={presale}>
                    <FloatingDashboard charts={this.chartData} title={t('summery')}/>
                </PermissableComponent>
                <Input
                    className="form-control"
                    type="text"
                    hint={t(`${this.TRANSLATE_PREFIX}.search`)}
                    placeholder={t(`${this.TRANSLATE_PREFIX}.search`)}
                    aria-label={t(`${this.TRANSLATE_PREFIX}.search`)}
                    value={this.query}
                    onChange={this.handleChange}
                />
                <Table responsive btn>
                    <TableHead>
                        <tr>
                            <th>{t(`${this.TRANSLATE_PREFIX}.columns.name`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.columns.email`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.columns.phone`)}</th>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.columns.tickets`)}</th>
                            </PermissableComponent>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.columns.ticketsTransferred`)}</th>
                            </PermissableComponent>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.columns.presale`)}</th>
                            </PermissableComponent>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.columns.allowToAllocate`)}</th>
                            </PermissableComponent>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {members.filter(this.filter).map(member => {
                            return (
                                <tr key={member.user_id}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.cell_phone}</td>
                                    <PermissableComponent permitted={ticketCount}>
                                        <td>
                                            {this.getMemberTicketCount(member.user_id)}
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={ticketCount}>
                                        <td>
                                            {this.getMemberTransfferedTicketCount(member.user_id)}
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={!!presale}>
                                        <td>
                                            <MDBTooltip
                                                placement="top"
                                                className="d-flex justify-content-center"
                                                tooltipContent={this.getMemberAllocationTooltip(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE)}>
                                                <input
                                                    onChange={(e) => this.changeAllocation(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE, e)}
                                                    disabled={this.isAllocatedByDifferentGroup(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE)}
                                                    checked={this.getMemberAllocationId(member.user_id, constants.ALLOCATION_TYPES.PRE_SALE, true)}
                                                    type="checkbox"/>
                                            </MDBTooltip>
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={presale}>
                                        <td className="d-flex justify-content-center">
                                            <input
                                                onChange={(e) => this.changeMembersAllocatingPermission(member.user_id, e)}
                                                checked={this.getMemberAllocationPermission(member.user_id)}
                                                type="checkbox"/>
                                        </td>
                                    </PermissableComponent>
                                </tr>
                            );
                        })}
                    </TableBody>
                </Table>
                <TableSummery csvName={`GroupMembersSummery - ${(new Date()).toDateString()}.csv`} sums={this.tableSums}
                              csvData={this.CSVdata}/>
            </div>


        )
    }

}

export const GroupMembers = withI18n()(BaseGroupMembers);