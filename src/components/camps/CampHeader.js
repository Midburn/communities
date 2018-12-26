import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { GroupsService } from '../../services/groups';
import { Row, Col } from 'mdbreact';
import Moment from 'react-moment';

class BaseCampBasicHeader extends React.Component {

    groupsService = new GroupsService();

    render() {
        const { t, camp } = this.props;
        return (
                <div>
                    <Row>
                        <Col md="11">
                            <h1 className="h1-responsive">{this.groupsService.getPropertyByLang(camp, 'name')}</h1>
                            <label>{t('since')}: <Moment format={'DD/MM/YYYY'}>{camp.created_at}</Moment></label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="11">
                            <h2 className="h2-responsive">{t('camps:camp.header.description')}</h2>
                            <p>
                                {this.groupsService.getPropertyByLang(camp, 'description')}
                            </p>
                        </Col>
                    </Row>
                </div>
        );
    }
}

export const CampHeader = withRouter(withI18n()(BaseCampBasicHeader));