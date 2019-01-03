import React from 'react';
import { withI18n } from 'react-i18next';
import { NavLink, withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Table, TableHead, TableBody, Input } from 'mdbreact';
import { action } from 'mobx/lib/mobx';
import { GroupsService } from '../../services/groups';
import { TableSummery } from '../controls/TableSummery';
import { PermissableComponent } from '../controls/PermissableComponent';

@observer
class BaseGroupsTable extends React.Component {

    groupsService = new GroupsService();

    @observable
    query = '';

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:management`;
    }

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

    match(group) {
        for (const searchProp of [
            group.camp_name_he || '',
            group.camp_name_en || '',
            group.contact_person_name || '',
            group.contact_person_email || '',
            group.contact_person_phone || ''
        ]) {
            if (searchProp.toLowerCase().includes(this.query)) {
                return true
            }
        }
        return false;
    }

    updateGroupsQuota(group, quota) {
        group.pre_sale_tickets_quota = quota;
        this.props.presaleQuotaChanged(group);
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
                [t(`${this.TRANSLATE_PREFIX}.table.quota`)]: g.quota || 0
            } : {};
            return {
                ...baseData,
                ...presaleData

            };
        })
    }

    getGroupAllocations(group) {
        return group.pre_sale_tickets_quota ? group.pre_sale_tickets_quota.toString() : '';
    }

    render() {
        const {t, groups, presale, match} = this.props;
        return (
            <div>
                <Input
                    className="form-control"
                    type="text"
                    hint={t(`${match.params.groupType}:search.title`)}
                    placeholder={t(`${match.params.groupType}:search.title`)}
                    aria-label={t(`${match.params.groupType}:search.title`)}
                    value={this.query}
                    onChange={this.handleChange}
                />
                <Table hover responsive btn>
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
                        </tr>
                    </TableHead>
                    <TableBody>
                        {groups.filter(this.filter).map(g => {
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
                                    <PermissableComponent permitted={presale}>
                                        <td>
                                            <Input
                                                type="number"
                                                hint={t(`${this.TRANSLATE_PREFIX}.table.noQuota`)}
                                                placeholder={t(`${this.TRANSLATE_PREFIX}.table.noQuota`)}
                                                aria-label={t(`${this.TRANSLATE_PREFIX}.table.noQuota`)}
                                                value={this.getGroupAllocations(g)}
                                                onChange={(e) => this.updateGroupsQuota(g, e.target.value)}/>
                                        </td>
                                    </PermissableComponent>
                                </tr>
                            );
                        })}
                    </TableBody>
                </Table>
                <TableSummery csvName={`GroupsAllocationSummery - ${(new Date()).toDateString()}.csv`}
                              sums={this.tableSums} csvData={this.CSVdata}/>
            </div>
        );
    }
}

export const GroupsTable = withRouter(withI18n()(BaseGroupsTable));
