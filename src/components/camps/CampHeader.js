import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { CampsService } from '../../services/camps';
import { Row, Col } from 'mdbreact';
import Moment from 'react-moment';

class BaseCampBasicHeader extends React.Component {

    campService = new CampsService();

    render() {
        const { t, camp } = this.props;
        return (
                <div>
                    <Row>
                        <Col md="11">
                            <h1 className="h1-responsive">{this.campService.getPropertyByLang(camp, 'name')}</h1>
                            <label>{t('campspage.since')}: <Moment format={'DD/MM/YYYY'}>{camp.created_at}</Moment></label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="11">
                            <h2 className="h2-responsive">{t('campspage.description')}</h2>
                            <p>
                                {this.campService.getPropertyByLang(camp, 'description')}
                            </p>
                        </Col>
                    </Row>
                </div>
        );
    }
}

export const CampHeader = withRouter(withI18n()(BaseCampBasicHeader));