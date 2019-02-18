import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { GroupsService } from '../../services/groups';
import { Row, Col } from 'mdbreact';
import './GroupHeader.scss'

class BaseGroupBasicHeader extends React.Component {
    groupsService = new GroupsService();

    render() {
        const { lng, match, t, group, isGroupMember } = this.props;
        const themeCamps = t('nav.camps.title')
        const campName = this.groupsService.getPropertyByLang(group, 'name')
        const myCampOrCampName = isGroupMember ? t('nav.camps.my') : campName
        const slash = lng === 'he' ? '/' : '\\'
        const campAndMyRelationText = `${themeCamps} ${slash} ${myCampOrCampName}`

        return (
                <div className="GroupHeader">
                  <Row>
                    <Col md="12">
                      <div className="font-size-13-responsive text-black2">{campAndMyRelationText}</div>
                    </Col>
                  </Row>
                    <Row>
                        <Col md="11">
                            <h1 className="h1-responsive text-blue">{this.groupsService.getPropertyByLang(group, 'name', lng)}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="11">
                            <div className="mb-h6-responsive text-black1">{t(`${match.params.groupType}:single.header.description`)}</div>
                            <p className="text-black2">
                                {this.groupsService.getPropertyByLang(group, 'description', lng)}
                            </p>
                        </Col>
                    </Row>
                </div>
        );
    }
}

export const GroupHeader = withRouter(withI18n()(BaseGroupBasicHeader));
