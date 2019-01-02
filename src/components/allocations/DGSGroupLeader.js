import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col } from 'mdbreact';
import { GroupsService } from '../../services/groups';
import { EventsService } from '../../services/events';
import './DGSAdmin.scss';
import { GroupMembers } from '../groups/Edit/GroupMembers';

@observer
class BaseDGSGroupLeader extends React.Component {

    groupService = new GroupsService();
    eventsService = new EventsService();

    @observable
    error;
    @observable
    group = {};
    @observable
    members = [];
    @observable
    tickets = [];

    componentWillReceiveProps(props) {
        this.getGroupData(props);
    }

    async getGroupData(props) {
        const {match} = props;
        try {
            const group = await this.groupService.getGroup(match.params.id);
            if (!group) {
                // TODO - 404 group not found
                return;
            }
            this.group = group;
            try {
                this.members = await this.groupService.getCampsMembers(this.group.id);
            } catch (e) {
                // TODO - what do we do with errors ?
                this.members = [];
                this.error = e;
            }
            try {
                const tickets = await this.groupService.getCampsMembersTickets(group.id);
                if (!tickets || !tickets.length) {
                    this.tickets = [];
                } else {
                    this.tickets = tickets;
                }
            } catch (e) {
                // TODO - what do we do with errors?
                this.tickets = [];
            }
        } catch (e) {
            this.error = e;
        }
    }


    async saveChanges() {
        try {
            // TODO - save changes to allocations.
        } catch (e) {

        }
    }

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:allocations.groupLeader`;
    }

    render() {
        const {t, match} = this.props;
        return (
            <div>
                <Row>
                    <Col md="12">
                        <h1 className="h1-responsive">{t(`${this.TRANSLATE_PREFIX}.header`)}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <p className="p-1">{t(`${this.TRANSLATE_PREFIX}.description`)} ({this.eventsService.getFormerEventId()})</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <GroupMembers group={this.group} presale={true} ticketCount={true} match={match} tickets={this.tickets || []} members={this.members || []}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const DGSGroupLeader = withRouter(withI18n()(BaseDGSGroupLeader));