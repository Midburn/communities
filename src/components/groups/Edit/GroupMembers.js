import React from 'react';
import { withI18n } from 'react-i18next';
import { Table, TableHead, TableBody, Input } from 'mdbreact';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PermissableComponent } from '../../controls/PermissableComponent';
import { TableSummery } from '../../controls/TableSummery';

@observer
class BaseGroupMembers extends React.Component {

    TRANSLATE_PREFIX = `members`;

    @observable
    query = '';

    @observable
    presaleAllocations = {};

    @observable
    memberPermissions = {};

    @observable
    tickets = [];

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

    changePresaleAllocation = (memberId, e) => {
        this.presaleAllocations[memberId] = e.target.checked;
    };

    getMemberTicketCount(memberId) {
        const {tickets} = this.props;
        if (!tickets) {
            return;
        }
        return tickets.filter(ticket => ticket.buyer_id === memberId).length;
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
            return false;
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
        for (const member of members) {
            allPurchasedTicketsCount += this.getMemberTicketCount(member.user_id) || 0;
            allTransfferedTicketsCount += this.getMemberTransfferedTicketCount(member.user_id) || 0;
            totalAllocated += this.presaleAllocations[member.user_id] ? 1 : 0;
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
                [t(`${this.TRANSLATE_PREFIX}.columns.presale`)]: this.presaleAllocations[member.user_id],
                [t(`${this.TRANSLATE_PREFIX}.columns.allowToAllocate`)]: this.getMemberAllocationPermission(member.user_id)
            } : {};
            return { ...baseData, ...preSaleData}
        })
    }

    render() {
        const {t, members, presale, ticketCount} = this.props;
        return (
            <div>
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
                                    <PermissableComponent permitted={presale}>
                                        <td>
                                            <input onChange={(e) => this.changePresaleAllocation(member.user_id, e)}
                                                   checked={this.presaleAllocations[member.user_id]} type="checkbox"/>
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={presale}>
                                        <td>
                                            <input onChange={(e) => this.changeMembersAllocatingPermission(member.user_id, e)}
                                                   checked={this.getMemberAllocationPermission(member.user_id)} type="checkbox"/>
                                        </td>
                                    </PermissableComponent>
                                </tr>
                            );
                        })}
                    </TableBody>
                </Table>
                <TableSummery csvName={`GroupMembersSummery - ${(new Date()).toDateString()}.csv`} sums={this.tableSums} csvData={this.CSVdata}/>
            </div>


        )
    }

}

export const GroupMembers = withI18n()(BaseGroupMembers);