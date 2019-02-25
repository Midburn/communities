import React from 'react';
import { withI18n } from 'react-i18next';
import { Row, Col, ListGroup, MDBIcon , MDBBtn, Card, CardBody   } from 'mdbreact';
import { ListItemWithBadge } from '../controls/ListItemWithBadge';
import { GroupsService } from '../../services/groups';
import { OneLineFieldValue } from './OneLineFieldValue'
import { GroupDetailListItem } from './GroupDetailListItem'
import {SvgIcon} from './SvgIcon'
import './GroupPublicationDetails.scss'


class BaseGroupPublicationDetails extends React.Component {
    groupsService = new GroupsService()

    t(term, options) {
        const {t, match} = this.props;
        return t(`${match.params.groupType}:${term}`, options);
    }

    get group() {
        return this.props.group;
    }

    get tCommon() {
        return this.props.t;
    }

      get lng () {
          return this.props.lng
      }

    get openToNewMembers() {
        return this.group.status === 'open' ? this.tCommon('yes') : this.tCommon('no');
    }

    get acceptFamilies() {
        return this.group.accept_families ? this.tCommon('yes') : this.tCommon('no');
    }

    get childFriendly() {
        return this.group.child_friendly ? this.tCommon('yes') : this.tCommon('no');
    }

    get art() {
        return this.group.support_art ? this.tCommon('yes') : this.tCommon('no');
    }

    get groupType () {
      return this.lng === 'he' ? 'מחנה תוכן (מוק)' : 'Theme group (MOCK)'
    }

    getColor(term) {
        return term ? 'success-color-dark' : 'danger-color-dark';
    }

    render () {
        console.log('this.group', this.group)
        return (
          <Row>
              <Col md="6">
                  <OneLineFieldValue fieldName={this.t('single.publication.campType')}>
                    {this.groupType}
                  </OneLineFieldValue>
                  <div className="mb-h6-responsive text-black1">{this.t('single.header.description')}</div>
                  <p className="text-black2 font-size-14-responsive">
                    {this.groupsService.getPropertyByLang(this.group, 'description', this.lng)}
                  </p>
                  <OneLineFieldValue fieldName={this.t('single.publication.details.noise')}>
                    {this.group.noise_level}
                  </OneLineFieldValue>
                  <OneLineFieldValue fieldName={this.t('single.publication.details.openMembers')}>
                    {this.openToNewMembers}
                  </OneLineFieldValue>
                  <OneLineFieldValue fieldName={this.t('single.publication.details.family')}>
                    {this.acceptFamilies}
                  </OneLineFieldValue>
                  <OneLineFieldValue fieldName={this.t('single.publication.details.children')}>
                    {this.childFriendly}
                  </OneLineFieldValue>

                  <div className="mb-h6-responsive text-black1">{this.t('single.publication.contactTitle')}</div>
                  <GroupDetailListItem icon={<SvgIcon name="person" size="16px"/>} text="מוביל שם-טוב"/>
              </Col>
              <Col md="6">
                  <div className="image-placeholder">image 600 X 400</div>
              </Col>
          </Row>
      )
    }

    render_o() {
        const { t, group } = this.props;
        return (
            <div className="CampSiteDetails">
                <Row>
                    <Col className="mb-4" xs="12" md="6">
                        <h5 className="h5-responsive">{this.t('single.publication.contactTitle')}</h5>
                        <ListGroup>
                            <ListItemWithBadge title={t('name')} value={group.contact_person_name}/>
                            <ListItemWithBadge title={t('phone')} value={group.contact_person_phone}/>
                            <ListItemWithBadge title={t('email')} value={group.contact_person_email}/>
                        </ListGroup>
                    </Col>
                    {      !!group.facebook_page_url ?
                        <Col xs="12" md="6" className="FacebookLink mb-4">
                            <div className="d-flex justify-content-between">
                                <h5 className="h5-responsive">{this.t('single.publication.facebook')}</h5>
                                <MDBBtn social="fb" color="primary" >
                                    <MDBIcon icon="facebook" className="pr-1" />Facebook
                                </MDBBtn >
                            </div>
                        </Col> : null
                    }
                    <Col xs="12" className="mb-4">
                        <h5 className="h5-responsive">{this.t('single.publication.details.title')}</h5>
                    </Col>
                    <Col xs="12" className="mb-4" md="4">
                        <ListGroup>
                            <ListItemWithBadge color={this.getColor(this.group.status === 'open')} title={this.t('single.publication.details.openMembers')} value={this.openToNewMembers}/>
                            <ListItemWithBadge color={this.getColor(this.group.accept_families)} title={this.t('single.publication.details.family')} value={this.acceptFamilies}/>
                            <ListItemWithBadge color={this.getColor(this.group.child_friendly)} title={this.t('single.publication.details.children')} value={this.childFriendly}/>
                            <ListItemWithBadge color={this.getColor(this.group.support_art)} title={this.t('single.publication.details.art')} value={this.art}/>
                        </ListGroup>
                    </Col>
                    <Col xs="12" className="mb-4" md="4">
                        <ListGroup>
                            <ListItemWithBadge color="primary" title={this.t('single.publication.details.time')} value={group.camp_activity_time}/>
                            <ListItemWithBadge color="primary" title={this.t('single.publication.details.noise')} value={group.noise_level}/>
                        </ListGroup>
                    </Col>
                    <Col xs="12" className="mb-4" md="4">
                        <ListGroup>
                            <ListItemWithBadge color="dark" title={this.t('single.publication.details.street')} value={group.camp_location_street}/>
                            <ListItemWithBadge color="dark" title={this.t('single.publication.details.hour')} value={group.camp_location_street_time}/>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const GroupPublicationDetails = withI18n()(BaseGroupPublicationDetails);
