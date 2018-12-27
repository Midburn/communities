import React from 'react';
import { Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { GroupHeader } from './GroupHeader';
import { ButtonGroup } from '../controls/ButtonGroup';
import './Group.scss';
import { GroupBasicInfo } from './Edit/GroupBasicInfo';
import { GroupPublicationDetails } from './GroupPublicationDetails';
import { state } from '../../models/state';
import { PermissableComponent } from '../../components/controls/PermissableComponent';
import { PermissionService } from '../../services/permissions';
import { ParsingService } from '../../services/parsing';

@observer
class BaseGroup extends React.Component {

    permissionService = new PermissionService();
    parsingService = new ParsingService();
    error = null;

    @observable
    editMode = false;

    @observable
    group = {};

    edit = () => {
        this.editMode = true;
        this.buttons = [this.viewButton];
        this.props.history.push({search: '?edit=true'});
    };

    view = () => {
        this.editMode = false;
        this.buttons = [this.editButton];
        this.props.history.push({search: ''});
    };

    editButton = {
        icon: 'pencil',
        onClick: this.edit,
        tooltip: this.props.t('edit')
    };

    viewButton = {
        icon: 'eye',
        onClick: this.view,
        tooltip: this.props.t('view')
    };

    buttons = [
        this.editButton
    ];

    constructor(props) {
        super(props);
        if (props.location.search.includes('edit=true')) {
            this.edit();
        }
        this.getCampData();
    }

    getCampData() {
        const {match} = this.props;
        try {
            const group = state.getSelectedGroup(this.parsingService.getGroupTypeFromString(match.params.groupType), +match.params.id);
            if (!group) {
                // TODO - 404 group not found
                return;
            }
            this.group = group;
        } catch (e) {
            this.error = e;
        }
    }

    render() {
        const {lng} = this.props;
        return (
            <div className="CampView">
                <Row>
                    <Col md="12">
                        <PermissableComponent permitted={this.permissionService.canEditThisGroup(this.group)}>
                            <div className={`ButtonGroup ${lng === 'he' ? 'left' : 'right'}`}>
                                <ButtonGroup buttons={this.buttons} vertical={true}/>
                            </div>
                        </PermissableComponent>
                        <GroupHeader group={this.group} editMode={this.editMode}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        {this.editMode ? <GroupBasicInfo group={this.group} onSave={this.saveChanges} /> : <GroupPublicationDetails group={this.group}/>}
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Group = withRouter(withI18n()(BaseGroup));