import React from 'react';
import { Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observer } from 'mobx-react';
import { EditableItem } from '../controls/EditableItem/EditableItem';

@observer
class BaseCreateGroup extends React.Component {
    state = {
        value: ''
    }

    handleTextChange = (event) => {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    render() {
        const { t } = this.props;

        return (
            <div>
                <Row>
                    <Col md="12">
                        <h2>{t('nav.camps.create.title')}</h2>
                        <div>{t('nav.camps.create.description')}</div>
                    </Col>
                    <Col md="12">
                        <EditableItem name="campHebName" title={`${t('nav.camps.create.campName')} (${t('hebrew')})`} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campEngName" title={`${t('nav.camps.create.campName')} (${t('english')})`} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderName" title={t('nav.camps.create.campLeaderName')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderPhone" title={t('nav.camps.create.campLeaderPhone')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderEmail" title={t('nav.camps.create.campLeadereEmail')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderMidburnProfileEmail" title={t('nav.camps.create.campLeaderMidburnProfileEmail')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campAdditionalName" title={t('nav.camps.create.campAdditionalName')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campContent" title={t('nav.camps.create.campContent')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campCharacter" title={t('nav.camps.create.campCharacter')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campNoiseCount" title={t('nav.camps.create.campNoiseCount')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campIsNewMembersOpen" title={t('nav.camps.create.campIsNewMembersOpen')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campMembersCount" title={t('nav.camps.create.campMembersCount')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.kidsFamilyCamp')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.newOrOldCamp')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.campParticipation')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>

                    <div>{t('nav.camps.create.leaderTeamCampDescription')}</div>

                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.campMoopLeaderFullname')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.campMoopLeaderEmail')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.securityLeaderName')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.securityLeaderEmail')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.soundLeaderName')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.soundLeaderEmail')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.ContentLeaderName')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.ContentLeaderEmail')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title={t('nav.camps.create.anythingElse')} value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>

                </Row>
            </div>
        );
    }
}

export const CreateGroup = withI18n()(BaseCreateGroup);
