import React from 'react';
import { Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { mockcamps } from './mockcamps';
import { withRouter } from 'react-router-dom';
import { CampHeader } from './CampHeader';
import { ButtonGroup } from '../controls/ButtonGroup';
import './Camp.scss';
import { CampEdit } from './Edit/CampEdit';
import { CampPublicationDetails } from './CampPublicationDetails';

@observer
class BaseCamp extends React.Component {

    @observable
    camps = mockcamps;

    @observable
    editMode = false;

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
    }

    render() {
        const {match, lng} = this.props;
        const camp = this.camps.find(camp => camp.id === +match.params.id);
        return (
            <div className="CampView">
                <Row>
                    <Col md="12">
                        <div className={`ButtonGroup ${lng === 'he' ? 'left' : 'right'}`}>
                            <ButtonGroup buttons={this.buttons} vertical={true}/>
                        </div>
                        <CampHeader camp={camp} editMode={this.editMode}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        {this.editMode ? <CampEdit camp={camp}/> : <CampPublicationDetails camp={camp}/>}
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Camp = withRouter(withI18n()(BaseCamp));