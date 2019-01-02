import React from 'react';
import { withI18n } from 'react-i18next';
import { Row, Col, ListGroup, MDBIcon , MDBBtn   } from 'mdbreact';
import { ListItemWithBadge } from '../controls/ListItemWithBadge';

class BaseGroupPublicationDetails extends React.Component {

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

    getColor(term) {
        return term ? 'success-color-dark' : 'danger-color-dark';
    }

    render() {
        const { t, group } = this.props;
        return (
            <div className="CampSiteDetails">
                <Row>
                    <Col className="mb-3" xs="12">
                        <h4 className="h4-responsive">{this.t('single.publication.title')}</h4>
                        <p >{this.t('single.publication.body')}</p>
                    </Col>
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