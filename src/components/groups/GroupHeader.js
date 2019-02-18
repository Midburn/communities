import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { GroupsService } from '../../services/groups';
import { Row, Col } from 'mdbreact';
import Moment from 'react-moment';

class BaseGroupBasicHeader extends React.Component {

    groupsService = new GroupsService();

    render() {
        const { match, t, group, lng } = this.props;
        return (
                <div>
                    <Row>
                        <Col md="11">
                            <h1 className="h1-responsive">{this.groupsService.getPropertyByLang(group, 'name', lng)}</h1>
                            <label>{t('since')}: <Moment format={'DD/MM/YYYY'}>{group.created_at}</Moment></label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="11">
                            <h2 className="h2-responsive">{t(`${match.params.groupType}:single.header.description`)}</h2>
                            <p>
                                {this.groupsService.getPropertyByLang(group, 'description', lng)}
                            </p>
                        </Col>
                    </Row>
                </div>
        );
    }
}

export const GroupHeader = withRouter(withI18n()(BaseGroupBasicHeader));