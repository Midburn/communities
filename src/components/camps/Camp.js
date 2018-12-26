import React from 'react';
import { Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { CampHeader } from './CampHeader';
import { ButtonGroup } from '../controls/ButtonGroup';
import './Camp.scss';
import { CampEdit } from './Edit/CampEdit';
import { CampPublicationDetails } from './CampPublicationDetails';
import { state } from '../../models/state';
import { GroupsService } from '../../services/groups';

@observer
class BaseCamp extends React.Component {

    groupsService = new GroupsService();
    error = null;

    @observable
    editMode = false;

    @observable
    camp = {};

    edit = () => {
        this.editMode = true;
        this.buttons = [this.viewButton];
        this.props.history.push({ search: '?edit=true'});
    };

    view = () => {
        this.editMode = false;
        this.buttons = [this.editButton];
        this.props.history.push({ search: ''});
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

    async getCampData() {
        const {match} = this.props;
        try {
            const camp = state.camps.find(camp => camp.id === +match.params.id);
            if (!camp) {
                // TODO - 404 camp not found
                return;
            }
            this.camp = camp;
            this.members = await this.groupsService.getCampsMembers(camp.id);
            console.log(this.members);
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
                        <div className={`ButtonGroup ${lng === 'he' ? 'left' : 'right'}`}>
                            <ButtonGroup buttons={this.buttons} vertical={true}/>
                        </div>
                        <CampHeader camp={this.camp} editMode={this.editMode}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        {this.editMode ? <CampEdit camp={this.camp}/> : <CampPublicationDetails camp={this.camp}/>}
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Camp = withRouter(withI18n()(BaseCamp));