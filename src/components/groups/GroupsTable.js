import React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {Table, TableHead, TableBody, MDBBtn, MDBTooltip} from 'mdbreact';
import {GroupsService} from '../../services/groups';
import {TableSummery} from '../controls/TableSummery';
import {PermissableComponent} from '../controls/PermissableComponent';
import * as constants from '../../../models/constants';
import {isMobileOnly} from 'react-device-detect';
import {NumberEditor} from "../controls/NumberEditor";
import {FiCheckCircle, FiPhone} from 'react-icons/fi';
import {withI18n} from 'react-i18next';
import * as moment from "moment";
import {DataHoverCard} from "../controls/DataHoverCard";
import {MdMailOutline} from "react-icons/md";
import NumberFormat from 'react-number-format';
import { Loader } from '../Loader';

class BaseGroupsTable extends React.Component {

    groupsService = new GroupsService();

    get TRANSLATE_PREFIX() {
        const {match} = this.props;
        return `${match.params.groupType}:management`;
    }

    updateGroupsQuota(group, quota) {
        this.props.presaleQuotaChanged(group, quota);
    }

    getFormerEventEntries(group) {
        if (!group || !group.former_tickets || !group.former_tickets.length) {
            return 0;
        }
        return group.former_tickets.filter(ticket => !!ticket.entrance_timestamp || !!ticket.first_entrance_timestamp).length;
    }

    get tableSums() {
        const {t, groups} = this.props;
        let membersSum = 0;
        for (const group of groups) {
            membersSum += group.members_count || 0;
        }
        return {
            [t(`${this.TRANSLATE_PREFIX}.sums.groups`)]: groups.length,
            [t(`${this.TRANSLATE_PREFIX}.sums.members`)]: membersSum,
        };
    }


    get CSVdata() {
        const {t, groups, presale} = this.props;
        return groups.map(g => {
            const baseData = {
                [t(`${this.TRANSLATE_PREFIX}.table.groupName`)]: this.groupsService.getPropertyByLang(g, 'name'),
                [t(`${this.TRANSLATE_PREFIX}.table.leaderName`)]: this.getManagerName(g),
                [t(`${this.TRANSLATE_PREFIX}.table.leaderEmail`)]: this.getManagerEmail(g),
                [t(`${this.TRANSLATE_PREFIX}.table.leaderPhone`)]: this.getManagerPhone(g),
                [t(`${this.TRANSLATE_PREFIX}.table.totalMembers`)]: g.members_count,
                [t(`${this.TRANSLATE_PREFIX}.table.totalPurchased`)]: (g.tickets || []).length
            };
            const presaleData = presale ? {
                [t(`${this.TRANSLATE_PREFIX}.table.totalEntered`)]: this.getFormerEventEntries(g),
                [t(`${this.TRANSLATE_PREFIX}.table.quota`)]: g.quota || 0,
                [t(`${this.TRANSLATE_PREFIX}.table.allocated`)]: this.getGroupAllocatedPercentage(g, constants.ALLOCATION_TYPES.PRE_SALE)
            } : {};
            return {
                ...baseData,
                ...presaleData

            };
        })
    }

    getGroupQuota(group, key) {
        const {groupQuotas} = this.props;
        if (!groupQuotas || !groupQuotas[key || constants.UNPUBLISHED_ALLOCATION_KEY]) {
            return 0;
        }
        const groupQuota = groupQuotas[key || constants.UNPUBLISHED_ALLOCATION_KEY].find(adminAllocation => adminAllocation.group_id === group.id);
        if (!groupQuota) {
            return 0;
        }
        return groupQuota.count;
    }

    getGroupAllocatedPercentage(group, allocationType) {
        const {allocations} = this.props;
        if (!allocations) {
            return '';
        }
        const allocated = allocations.filter(allocation => allocation.related_group === group.id && allocation.allocation_type === allocationType).length;
        // TODO - handle other types of allocations.
        const quota = allocationType === constants.ALLOCATION_TYPES.PRE_SALE ? group.pre_sale_tickets_quota: 0;
        if (quota === 0) {
            return 0;
        }
        return (allocated || 0) / quota;
    }

    /**
     * Methods relevant to getting manager details
     */
    getManagerName(group) {
        if (!group || !group.manager) {
            return ' ';
        }
        // We might have empty data in managers name - so we need to try and fetch it from several places
        return group.manager.name || this.extractNameFromJSON(group.manager);
    }

    extractNameFromJSON(manager) {
        try {
            const extraData = JSON.parse(manager.json);
            return `${extraData.drupal_data.address.first_name} ${extraData.drupal_data.address.last_name}`;
        } catch (e) {
            return  ' ';
        }
    }

    getManagerPhone(group) {
        return group && group.manager ? group.manager.phone : ' ';
    }

    getManagerEmail(group) {
        return group && group.manager ? group.manager.email : ' ';
    }

    getManagerExtraDetails(group) {
        if (!group  || !group.manager) {
            return ' ';
        }
        return (
            <div>
                <div className="d-flex align-items-center">
                    <FiPhone /><span className="ml-2 mr-2">{this.getManagerPhone(group)}</span>
                </div>
                <div className="d-flex align-items-center">
                    <MdMailOutline /><span className="ml-2 mr-2">{this.getManagerEmail(group)}</span>
                </div>
            </div>
        );
    }

    render() {
        const {t, groups, isLoading, presale, groupQuotas, publishQuota} = this.props;
        if (isLoading) 
        {
            return <Loader />
        }
        const PublishButton = <MDBBtn className="blue" onClick={publishQuota}>
            <FiCheckCircle/>
            {t(`${this.TRANSLATE_PREFIX}.table.publish`)}
        </MDBBtn>;
        return (
            <div>
                <PermissableComponent permitted={!isMobileOnly}>
                    <TableSummery csvName={`GroupsAllocationSummery - ${(new Date()).toDateString()}.csv`}
                                  moreButtons={presale ? PublishButton : ' '}
                                  sums={this.tableSums} csvData={this.CSVdata}/>
                </PermissableComponent>
                <Table hover responsive btn className="GroupsTable">
                    <TableHead>
                        <tr>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.groupName`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.leaderName`)}</th>
                            <th>{t(`${this.TRANSLATE_PREFIX}.table.totalMembers`)}</th>
                            <PermissableComponent permitted={presale}>
                                <th>{t(`${this.TRANSLATE_PREFIX}.table.totalEntered`)}</th>
                                <th>{t(`${this.TRANSLATE_PREFIX}.table.quota`)}</th>
                                {
                                    Object.keys((groupQuotas || [])).map((key, i) => {
                                        return key === constants.UNPUBLISHED_ALLOCATION_KEY ? null :
                                            (
                                                <MDBTooltip placement="bottom"
                                                            key={key}
                                                            tag="th"
                                                            tooltipContent={`${t('published')}: ${moment(new Date(key)).format('DD/MM/YYYY, HH:mm:ss')}`}>
                                                    {t('round')} {i + 1}
                                                </MDBTooltip>
                                            );
                                    })
                                }
                                <th>{t(`${this.TRANSLATE_PREFIX}.table.allocated`)}</th>
                            </PermissableComponent>

                        </tr>
                    </TableHead>
                    <TableBody>
                        {groups.map(g => {
                            return (
                                <tr key={g.id}>
                                    <td>
                                        <NavLink
                                            to={`${g.id}`}>{this.groupsService.getPropertyByLang(g, 'name')}</NavLink>
                                    </td>
                                    <td>
                                        <DataHoverCard title={this.getManagerName(g)} panel={this.getManagerExtraDetails(g)}/>
                                    </td>
                                    <td>
                                        {g.members_count}
                                    </td>
                                    <PermissableComponent permitted={presale}>
                                        <td>
                                            {this.getFormerEventEntries(g)}
                                        </td>
                                    </PermissableComponent>
                                    <PermissableComponent permitted={presale && groupQuotas}>
                                        <td>
                                            <NumberEditor value={this.getGroupQuota(g)} min={0}
                                                          onChange={(e) => this.updateGroupsQuota(g, e)}/>
                                        </td>
                                        {
                                            Object.keys((groupQuotas || [])).map(key => {
                                                return key === constants.UNPUBLISHED_ALLOCATION_KEY ? null :
                                                    (
                                                        <td key={key}>
                                                            {this.getGroupQuota(g, key)}
                                                        </td>
                                                    );
                                            })
                                        }
                                        <td>
                                            <NumberFormat decimalScale={1} displayType={"text"} value={this.getGroupAllocatedPercentage(g, constants.ALLOCATION_TYPES.PRE_SALE) * 100} suffix={"%"}/>
                                        </td>
                                    </PermissableComponent>
                                </tr>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export const GroupsTable = withRouter(withI18n()(BaseGroupsTable));
