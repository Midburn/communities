import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'mdbreact';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs } from '../../controls/Tabs';
import { CampFiles } from './CampFiles';
import { CampSuppliers } from './CampSuppliers';
import { GroupMembers } from './GroupMembers';
import { GroupHeader } from '../GroupHeader';
import { GroupsService } from '../../../services/groups';

@observer
class BaseGroupManagement extends React.Component {

    groupService = new GroupsService();

    @observable
    activeTab = 1;
    @observable
    group = {};
    @observable
    members = [];
    constructor(props) {
        super(props);
        this.getGroupData(props);
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

    saveChanges(editedGroup) {
        const groupToSave = {
            ...this.props.editedGroup,
            ...editedGroup
        }
        // TODO - send to BE.
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
                this.members = await this.groupService.getCampsMembers(this.group.id);
            } catch (e) {
                // TODO - what do we do with errors ?
                console.warn(e.stack);
                this.members = [];
                this.error = e;
            }
        } catch (e) {
            console.warn(e.stack);
            this.error = e;
        }
    }

    render() {
        const {t, match} = this.props;
        const tabs = [
            {
                id: 1,
                title: t(`${match.params.groupType}:single.edit.tabs.members`),
                component: <GroupMembers key={3} members={this.members} onSave={this.saveChanges} />
            },
            // {
            //     id: 2,
            //     title: t(`${match.params.groupType}:single.edit.tabs.files`),
            //     component: <CampFiles key={2} group={this.group} onSave={this.saveChanges} />
            // },
            // {
            //     id: 3,
            //     title: t(`${match.params.groupType}:single.edit.tabs.suppliers`),
            //     component: <CampSuppliers key={3} group={this.group} onSave={this.saveChanges} />
            // }
        ];

        return (
            <div>
                <Row>
                    <Col md="12">
                        <GroupHeader group={this.group} editMode={false}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Tabs tabs={tabs} selectedId={this.activeTab} onSelect={(e) => this.setActiveTab(e)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const GroupManagement = withRouter(withI18n()(BaseGroupManagement));