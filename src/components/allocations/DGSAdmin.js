import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col } from 'mdbreact';
import { DGSGroupsTable } from './DGSGroupsTable';
import { GroupsService } from '../../services/groups';
import { ParsingService } from '../../services/parsing';
import { EventsService } from '../../services/events';
import { ButtonGroup } from '../controls/ButtonGroup';
import './DGSAdmin.scss';

@observer
class BaseDGSAdmin extends React.Component {

    parsingService = new ParsingService();
    groupService = new GroupsService();
    eventsService = new EventsService();

    @observable
    error;

    @observable
    groups = [];

    saveButton = {
        icon: 'save',
        onClick: this.saveChanges,
        tooltip: this.props.t('saveChanges')
    };


    constructor(props) {
        super(props);
        this.init();
    }

    async init() {
        try {
            const {match} = this.props;
            this.groups = (await this.groupService.getAllGroups(this.parsingService.getGroupTypeFromString(match.params.groupType), this.eventsService.getFormerEventId())) || [];
            this.getGroupsMembersCount();
            this.getGroupsTickets();
            this.getGroupsFormerEventTickets();
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

    /**
     * For displaying entered count (for former event)
     * @returns {Promise<void>}
     */
    async getGroupsFormerEventTickets() {
        for (const group of this.groups) {
            try {
                const tickets = await this.groupService.getCampsMembersTickets(group.id, this.eventsService.getFormerEventId());
                if (!tickets || !tickets.length) {
                    group.former_tickets = [];
                } else {
                    group.former_tickets = tickets;
                }
            } catch (e) {
                // TODO - what do we do with errors?
                group.members_count = 0;
            }
        }
    }

    async saveChanges() {
        try {
            // TODO - save changes to allocations.
        }catch (e) {

        }
    }

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:allocations.dgsAdmin`;
    }

    render() {
        const {t,lng} = this.props;
        return (
            <div className="DGSAdmin">
                <Row>
                    <Col md="12">
                        <h1 className="h1-responsive">{t(`${this.TRANSLATE_PREFIX}.header`)} ({this.eventsService.getFormerEventId()})</h1>
                        <div className={`ButtonGroup ${lng === 'he' ? 'left' : 'right'}`}>
                            <ButtonGroup buttons={[this.saveButton]} vertical={true}/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <p className="p-1">{t(`${this.TRANSLATE_PREFIX}.description`)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <DGSGroupsTable groups={this.groups}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const DGSAdmin = withRouter(withI18n()(BaseDGSAdmin));