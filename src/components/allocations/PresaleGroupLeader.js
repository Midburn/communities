import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col } from 'mdbreact';
import { GroupsService } from '../../services/groups';
import { EventsService } from '../../services/events';
import { GroupMembers } from '../groups/Edit/GroupMembers';
import { AllocationService } from '../../services/allocations';
import Moment from 'react-moment';
import { UsersService } from '../../services/users';
import { AuditService } from '../../services/audit';
import * as constants from '../../../models/constants';
import { PermissableComponent } from '../controls/PermissableComponent';
import { EventRulesService } from '../../services/event-rules';
import { PermissionService } from '../../services/permissions';

@observer
class BaseDGSGroupLeader extends React.Component {

    groupService = new GroupsService();
    eventsService = new EventsService();
    allocationsService = new AllocationService();
    auditService = new AuditService();
    usersService = new UsersService();
    eventRules = new EventRulesService();
    permissionsService = new PermissionService();

    @observable
    error;
    @observable
    group = {};
    @observable
    members = [];
    @observable
    tickets = [];
    @observable
    allocations = [];
    @observable
    auditedUser = [];
    @observable
    groupPermissions = [];

    get lastAudit() {
        if (!this.audits || !this.audits[0]) {
            return;
        }
        return this.audits[0].createdAt;
    }

    constructor(props) {
        super(props);
        this.checkPermissions(props);
        this.getGroupData(props);
    }

    checkPermissions(props) {
        const {match} = props;
        if (!this.permissionsService.isAllowedToAllocateTickets(match.params.id)) {
            this.permissionsService.redirectToSpark();
        }
    }

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
                this.members = await this.groupService.getCampsMembers(this.group.id, this.eventsService.getFormerEventId());
            } catch (e) {
                console.warn(e.stack);
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
                console.warn(e.stack);
                // TODO - what do we do with errors?
                this.tickets = [];
            }
            await this.getGroupAllocations();
            await this.getAudits();
            await this.getGroupPermissions();
        } catch (e) {
            console.warn(e.stack);
            this.error = e;
        }
    }

    getGroupPermissions = async () => {
        try {
            this.groupPermissions = await this.permissionsService.getPermissionsRelatedToEntity(this.group.id);
        } catch (e) {
            console.warn(e);
        }
    }

    allocationsChanged = async () => {
        try {
            await this.getGroupAllocations();
            await this.auditService.setAudit(constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_GROUP, {related_entity: this.group.id});
            await this.getAudits();
        } catch (e) {
            console.warn(e.stack);
        }
    };

    async getAudits() {
        try {
            this.audits = await this.auditService.getAuditsForEntity(constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_GROUP, this.group.id);
            if (this.audits && this.audits[0]) {
                this.auditedUser = (await this.usersService.getUserNameById(this.audits[0].updated_by)) || {};
            }
        } catch (e) {
            // TODO - what do we do with errors
            console.warn(e.stack);
        }
    }

    getGroupAllocations = async () => {
        try {
            this.allocations = (await this.allocationsService.getMembersAllocations([this.members.map(member => member.user_id)])) || [];
        } catch (e) {
            console.warn(e);
        }
    }

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:groupLeader`;
    }

    render() {
        const {t, match} = this.props;
        return (
            <div>
                <Row>
                    <Col md="12">
                        <h1 className="h1-responsive">{t(`${this.TRANSLATE_PREFIX}.header`)} - {this.groupService.getPropertyByLang(this.group, 'name')}</h1>
                    </Col>
                </Row>
                <PermissableComponent permitted={this.lastAudit}>
                    <Row>
                        <Col md="6">
                            <span>{t(`lastUpdate`)}: </span>
                            <Moment className="pl-2 pr-2"
                                    format={'DD/MM/YYYY, HH:mm:ss'}>{this.lastAudit}</Moment>
                            <span className="pl-2 pr-2">{t('by')}: </span><span>{this.auditedUser.name}</span>
                        </Col>
                        <Col md="6">
                            <span>{t(`allocationsLastDate`)}: </span>
                            <Moment className="pl-2 pr-2"
                                    format={'DD/MM/YYYY, HH:mm:ss'}>{this.eventRules.lastDateToAllocatePreSale}</Moment>
                        </Col>
                    </Row>
                </PermissableComponent>
                <Row>
                    <Col md="12">
                        <p className="p-1">{t(`${this.TRANSLATE_PREFIX}.description`)} ({this.eventsService.getFormerEventId()})</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <GroupMembers permissions={this.groupPermissions}
                                      permissionsChanged={this.getGroupPermissions}
                                      allocationsChanged={this.allocationsChanged}
                                      allocations={this.allocations}
                                      group={this.group} presale={true} ticketCount={true} match={match}
                                      tickets={this.tickets || []} members={this.members || []}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const PresaleGroupLeader = withRouter(withI18n()(BaseDGSGroupLeader));