import React from 'react';
import { withI18n } from 'react-i18next';
import { Table, TableHead, TableBody, Input } from 'mdbreact';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class BaseGroupMembers extends React.Component {

    TRANSLATE_PREFIX = `members`;

    @observable
    query = '';
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

    render() {
        const {t, members} = this.props;
        console.log(members);
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
                            <th>{t(`${this.TRANSLATE_PREFIX}.columns.name`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.columns.email`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.columns.phone`)}</th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {members.filter(this.filter).map(member => {
                            return (
                                <tr key={member.user_id}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.cell_phone}</td>
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