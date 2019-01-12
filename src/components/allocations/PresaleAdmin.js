import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Row, Col } from 'mdbreact';
import { GroupsTable } from '../groups/GroupsTable';
import { GroupsService } from '../../services/groups';
import { ParsingService } from '../../services/parsing';
import { EventsService } from '../../services/events';
import { AuditService } from '../../services/audit';
import { ButtonGroup } from '../controls/ButtonGroup';
import * as constants from '../../../models/constants';
import './PresaleAdmin.scss';
import Moment from 'react-moment';
import { UsersService } from '../../services/users';
import { AllocationService } from '../../services/allocations';
import { action } from 'mobx/lib/mobx';
import { SearchInput } from '../controls/SearchInput';
import { PermissableComponent } from '../controls/PermissableComponent';

@observer
class BasePresaleAdmin extends React.Component {

    parsingService = new ParsingService();
    groupService = new GroupsService();
    eventsService = new EventsService();
    auditService = new AuditService();
    usersService = new UsersService();
    allocationsService = new AllocationService();
    /**
     * We'll keep track of groups changed in order to send them on save.
     */
    @observable
    changes = {};

    @observable
    error;

    @observable
    groups = [];

    @observable
    audits = [];

    @observable
    auditedUser = [];

    @observable
    allocations = [];

    @observable
    groupQuotas = [];

    @observable
    query = '';

    get lastAudit() {
        if (!this.audits || !this.audits.length || !this.audits[0]) {
            return;
        }
        return this.audits[0].createdAt;
    }

    constructor(props) {
        super(props);
        this.init(props);
    }

    componentWillReceiveProps(props) {
        this.init(props);
    };

    async init(props) {
        try {
            const {match} = props;
            this.groups = (await this.groupService.getAllGroups(this.parsingService.getGroupTypeFromString(match.params.groupType), this.eventsService.getFormerEventId())) || [];
            await this.getGroupsMembersCount();
            await this.getGroupsTickets();
            await this.getGroupsFormerEventTickets();
            await this.getAdminAllocations();
            await this.getGroupsAllocations();
            await this.getAudits();
        } catch (e) {
            // TODO - what do we do with errors?
            this.error = e;
        }
    }

    async getAudits() {
        try {
            this.audits = await this.auditService.getAudits(constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_ADMIN);
            if (this.audits && this.audits[0]) {
                this.auditedUser = (await this.usersService.getUserNameById(this.audits[0].updated_by)) || {};
            }
        } catch (e) {
            // TODO - what do we do with errors
            console.warn(e.stack);
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

    async getGroupsAllocations() {
        try {
            this.allocations = (await this.allocationsService.getGroupsAllocations([this.groups.map(g => g.id)])) || [];
            console.log(this.groupQuotas);
        } catch (e) {
            console.warn(e);
        }
    }

    async getAdminAllocations() {
        try {
            this.groupQuotas = (await this.allocationsService.getAdminsAllocations(constants.ALLOCATION_TYPES.PRE_SALE)) || [];
        } catch (e) {
            console.warn(e);
        }
    }

    saveChanges = async () => {
        try {
            const update = this.groups.map(group => {
                let updatedQouta;
                const groupUpdate = this.groupQuotas.find(allocation => allocation.group_id === group.id);
                if (!groupUpdate) {
                    updatedQouta = (group.pre_sale_tickets_quota || 0);
                } else {
                    updatedQouta = (group.pre_sale_tickets_quota || 0) + (groupUpdate.count || 0);
                }
                return {
                    id: group.id,
                    pre_sale_tickets_quota: updatedQouta
                }
            });
            if (!update || !update.length) {
                return;
            }
            await this.groupService.updatePresaleQuota(update);
            this.changes = {};
            await this.auditService.setAudit(constants.AUDIT_TYPES.PRESALE_ALLOCATIONS_ADMIN);
            await this.getAudits();
        } catch (e) {
            console.warn(`Error saving presale quota! - ${e.stack}`);
        }
    };

    saveButton = {
        icon: 'save',
        onClick: this.saveChanges.bind(this),
        tooltip: this.props.t('saveChanges')
    };

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:management`;
    }

    presaleQuotaChanged = async (group, quota) => {
        try {
            await this.allocationsService.addAllocationsToGroup(constants.ALLOCATION_TYPES.PRE_SALE, group.id, quota);
            await this.getAdminAllocations();
        } catch (e) {
            console.warn(e.stack);
        }
    };

    /**
     * Filter related methods (change, filter, match)
     */
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
        const {t, match} = this.props;
        return (
            <div className="DGSAdmin">
                <Row>
                    <Col md="12">
                        <h1 className="h1-responsive">{t(`${this.TRANSLATE_PREFIX}.allocations.header`)}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <p className="p-1">{t(`${this.TRANSLATE_PREFIX}.allocations.description`)} ({this.eventsService.getFormerEventId()})</p>
                    </Col>
                </Row>
                <Row className="mt-4 mb-4">
                    <Col md="6">
                        <SearchInput value={this.query} onChange={this.handleChange} placeholder={t(`${match.params.groupType}:search.title`)}/>
                    </Col>
                    <PermissableComponent permitted={!!this.lastAudit}>
                        <Col md="6">
                            <span>{t(`lastUpdate`)}: </span><Moment className="pl-2 pr-2" format={'DD/MM/YYYY, HH:mm:ss'}>{this.lastAudit}</Moment>
                            <span className="pl-2 pr-2">{t('by')}: </span><span>{this.auditedUser.name}</span>
                        </Col>
                    </PermissableComponent>
                </Row>
                <Row>
                    <Col md="12">
                        <GroupsTable publishQuota={this.saveChanges}
                            allocations={this.allocations}
                                     groupQuotas={this.groupQuotas}
                            presale={true} groups={(this.groups || []).filter(this.filter)}
                                     presaleQuotaChanged={this.presaleQuotaChanged}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const PresaleAdmin = withRouter(withI18n()(BasePresaleAdmin));