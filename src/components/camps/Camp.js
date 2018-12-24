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
import { CampSiteDetails } from './CampSiteDetails';
import FlipMove from 'react-flip-move';

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
        tooltip: "Edit",
    };

    viewButton = {
        icon: 'eye',
        onClick: this.view,
        tooltip: "View",
    };

    buttons = [
        this.editButton
    ];

    constructor(props) {
        super(props);
        if (props.location.search.includes('edit=true')) {
            this.edit();
        };
    }

    render() {
        const {match} = this.props;
        const camp = this.camps.find(camp => camp.id === +match.params.id);
        return (
            <div className="CampView">
                <Row>
                    <Col md="12">
                        <div className="ButtonGroup">
                            <ButtonGroup buttons={this.buttons} vertical={true}/>
                        </div>
                        <CampHeader camp={camp} editMode={this.editMode}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FlipMove>
                            {this.editMode ? <CampEdit camp={camp}/> : <CampSiteDetails camp={camp}/>}
                        </FlipMove>
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Camp = withRouter(withI18n()(BaseCamp));