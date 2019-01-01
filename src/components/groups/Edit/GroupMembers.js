import React from 'react';
import { withI18n } from 'react-i18next';
import { Table, TableHead, TableBody, Input } from 'mdbreact';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PermissableComponent } from '../../controls/PermissableComponent';

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

    getMemberTicketCount(tickets, memberId) {
        return tickets.filter(ticket => ticket.buyer_id === memberId).length;
    }

    getMemberTransfferedTicketCount(tickets, memberId) {
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

    render() {
        const {t, members, presale, tickets, ticketCount} = this.props;
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
                                            {this.getMemberTicketCount(tickets, member.user_id)}
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={ticketCount}>
                                        <td>
                                            {this.getMemberTransfferedTicketCount(tickets, member.user_id)}
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
            </div>


        )
    }

}

export const GroupMembers = withI18n()(BaseGroupMembers);