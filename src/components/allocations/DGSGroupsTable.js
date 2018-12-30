import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Table, TableHead, TableBody, Input } from 'mdbreact';
import { action } from 'mobx/lib/mobx';
import { GroupsService } from '../../services/groups';

@observer
class BaseDGSGroupsTable extends React.Component {

    groupsService = new GroupsService();
    @observable
    query = '';

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:allocations.dgsAdmin.table`;
    }

    constructor(params) {
        super(params);
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

    render() {
        const {t, groups} = this.props;
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
                <Table responsive>
                    <TableHead>
                        <tr>
                            <th>{t(`${this.TRANSLATE_PREFIX}.groupName`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.leaderName`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.leaderEmail`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.leaderPhone`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.totalMembers`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.totalPurchased`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.quota`)}</th>
                            <th>{t(`actions`)}</th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {groups.filter(this.filter).map(g => {
                            return (
                                <tr key={g.id}>
                                    <td>
                                        {this.groupsService.getPropertyByLang(g, 'name')}
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
                                    <td></td>
                                </tr>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export const DGSGroupsTable = withRouter(withI18n()(BaseDGSGroupsTable));
