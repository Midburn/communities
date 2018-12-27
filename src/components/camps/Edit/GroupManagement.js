import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'mdbreact';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs } from '../../controls/Tabs';
import { CampFiles } from './CampFiles';
import { CampMembers } from './CampMembers';
import { CampSuppliers } from './CampSuppliers';

@observer
class BaseGroupManagement extends React.Component {

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

    saveChanges(editedGroup) {
        const groupToSave = {
            ...this.props.editedGroup,
            ...editedGroup
        }
        // TODO - send to BE.
    }

    render() {
        const {t, group, match} = this.props;
        const tabs = [
            {
                id: 1,
                title: t(`${match.params.groupType}:single.edit.tabs.members`),
                component: <CampMembers key={3} group={group} onSave={this.saveChanges} />
            },
            {
                id: 2,
                title: t(`${match.params.groupType}:single.edit.tabs.files`),
                component: <CampFiles key={4} group={group} onSave={this.saveChanges} />
            },
            {
                id: 3,
                title: t(`${match.params.groupType}:single.edit.tabs.suppliers`),
                component: <CampSuppliers key={5} group={group} onSave={this.saveChanges} />
            }
        ];

        return (
            <div>
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