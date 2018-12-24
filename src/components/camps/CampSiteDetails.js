import React from 'react';
import { withI18n } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { CampsService } from '../../services/camps';
import { Row, Col, ListGroup, MDBIcon , MDBBtn   } from 'mdbreact';
import { ListItemWithBadge } from '../controls/ListItemWithBadge';

class BaseCampSiteDetails extends React.Component {

    campService = new CampsService();

    get camp() {
        return this.props.camp;
    }

    get t() {
        return this.props.t;
    }

    get openToNewMembers() {
        return this.camp.status === 'open' ? this.t('yes') : this.t('no');
    }

    get acceptFamilies() {
        return this.camp.accept_families ? this.t('yes') : this.t('no');
    }

    get childFriendly() {
        return this.camp.child_friendly ? this.t('yes') : this.t('no');
    }

    get art() {
        return this.camp.support_art ? this.t('yes') : this.t('no');
    }

    getColor(term) {
        return term ? 'success-color-dark' : 'danger-color-dark';
    }

    render() {
        const { t, camp } = this.props;
        return (
            <div className="CampSiteDetails">
                <Row>
                    <Col className="mb-3" xs="12">
                        <h4 className="h4-responsive">{t('campspage.publication.title')}</h4>
                        <p >{t('campspage.publication.body')}</p>
                    </Col>
                    <Col className="mb-4" xs="12" md="6">
                        <h5 className="h5-responsive">{t('campspage.publication.contactTitle')}</h5>
                        <ListGroup>
                            <ListItemWithBadge title={t('name')} value={camp.contact_person_name}/>
                            <ListItemWithBadge title={t('phone')} value={camp.contact_person_phone}/>
                            <ListItemWithBadge title={t('email')} value={camp.contact_person_email}/>
                        </ListGroup>
                    </Col>
                    {      !!camp.facebook_page_url ?
                        <Col xs="12" md="6" className="FacebookLink mb-4">
                            <div className="d-flex justify-content-between">
                                <h5 className="h5-responsive">{t('campspage.publication.facebook')}</h5>
                                <MDBBtn social="fb" color="primary" >
                                    <MDBIcon icon="facebook" className="pr-1" />Facebook
                                </MDBBtn >
                            </div>
                        </Col> : null
                    }
                    <Col xs="12" className="mb-4">
                        <h5 className="h5-responsive">{t('campspage.publication.details.title')}</h5>
                    </Col>
                    <Col xs="12" className="mb-4" md="4">
                        <ListGroup>
                            <ListItemWithBadge color={this.getColor(this.camp.status === 'open')} title={t('campspage.publication.details.openMembers')} value={this.openToNewMembers}/>
                            <ListItemWithBadge color={this.getColor(this.camp.accept_families)} title={t('campspage.publication.details.family')} value={this.acceptFamilies}/>
                            <ListItemWithBadge color={this.getColor(this.camp.child_friendly)} title={t('campspage.publication.details.children')} value={this.childFriendly}/>
                            <ListItemWithBadge color={this.getColor(this.camp.support_art)} title={t('campspage.publication.details.art')} value={this.art}/>
                        </ListGroup>
                    </Col>
                    <Col xs="12" className="mb-4" md="4">
                        <ListGroup>
                            <ListItemWithBadge color="primary" title={t('campspage.publication.details.time')} value={camp.camp_activity_time}/>
                            <ListItemWithBadge color="primary" title={t('campspage.publication.details.noise')} value={camp.noise_level}/>
                        </ListGroup>
                    </Col>
                    <Col xs="12" className="mb-4" md="4">
                        <ListGroup>
                            <ListItemWithBadge color="dark" title={t('campspage.publication.details.street')} value={camp.camp_location_street}/>
                            <ListItemWithBadge color="dark" title={t('campspage.publication.details.hour')} value={camp.camp_location_street_time}/>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const CampSiteDetails = withRouter(withI18n()(BaseCampSiteDetails));