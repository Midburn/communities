import React from 'react';
import { FormInline, Fa, Input, Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { GroupList } from './GroupList';
import { state } from '../../models/state';
import * as constants from '../../../models/constants';
import { GroupsTable } from './GroupsTable';
import { EventsService } from '../../services/events';
import { ParsingService } from '../../services/parsing';
import { GroupsService } from '../../services/groups';
import { Tabs } from '../controls/Tabs';
import { PresaleAdmin } from '../allocations/PresaleAdmin';

@observer
class BaseGroupsManagement extends React.Component {

    parsingService = new ParsingService();
    groupService = new GroupsService();

    @observable
    error;

    @observable
    groups = [];

    getTranslatePath(type) {
        return `${type}:management`;
    }

    @observable
    activeTab = 1;

    constructor(props) {
        super(props);
        if (props.location.hash) {
            this.setActiveTab(props.location.hash.replace('#', ''))
        }
    }

    setActiveTab(tab) {
        tab = +tab;
        if (this.activeTab !== tab) {
            this.activeTab = tab;
            this.props.history.push({hash: `#${tab}`, search: this.props.location.search})
        }
    }

    @computed
    get listData() {
        const {match} = this.props;
        const type = match.params.groupType;
        return type.includes(constants.GROUP_TYPES.CAMP) ? state.camps : state.artInstallations
    }

    componentWillReceiveProps(props) {
        this.init(props);
    }

    async init(props) {
        try {
            const {match} = props;
            this.groups = (await this.groupService.getAllGroups(this.parsingService.getGroupTypeFromString(match.params.groupType))) || [];
            this.getGroupsMembersCount();
            this.getGroupsTickets();
        } catch (e) {
            this.groups = [];
            // TODO - what do we do with errors?
            this.error = e;
        }
    }

    /**
     * For displaying member count (for former event)
     * @returns {Promise<void>}
     */
    async getGroupsMembersCount() {
        for (const group of this.groups) {
            try {
                const members = await this.groupService.getCampsMembersCount(group.id);
                for (const member of members) {
                    if (member.status === 'approved_mgr') {
                        group.members_count = !isNaN(group.members_count) ? group.members_count++ : 1;
                    }
                }
            } catch (e) {
                // TODO - what do we do with errors?
                group.members_count = 0;
            }
        }
    }

    /**
     * For displaying ticket count (for this event)
     * @returns {Promise<void>}
     */
    async getGroupsTickets() {
        for (const group of this.groups) {
            try {
                const tickets = await this.groupService.getCampsMembersTickets(group.id);
                if (!tickets || !tickets.length) {
                    group.tickets = [];
                } else {
                    group.tickets = tickets;
                }
            } catch (e) {
                // TODO - what do we do with errors?
                group.members_count = 0;
            }
        }
    }

    render() {
        const {t, match} = this.props;
        const type = match.params.groupType;
        const tabs = [
            {
                id: 1,
                title: t(`${this.getTranslatePath(type)}.tabs.groups`),
                component: <GroupsTable key={1} groups={this.groups}/>
            },
            {
                id: 2,
                title: t(`${this.getTranslatePath(type)}.tabs.presale`),
                component: <PresaleAdmin key={2} />
            }

        ];
        return (
            <div>
                <Row>
                    <Col md="12">
                        <h1>{t(`${this.getTranslatePath(type)}.header`)}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tabs tabs={tabs} selectedId={this.activeTab} onSelect={(e) => this.setActiveTab(e)}/>
                    </Col>
                </Row>
            </div>

        );
    }
}

export const GroupsManagement = withI18n()(BaseGroupsManagement);