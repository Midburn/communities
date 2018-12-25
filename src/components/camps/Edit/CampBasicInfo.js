import React from 'react';
import { withI18n } from 'react-i18next';
import { Col, Row, Card, CardBody } from 'mdbreact';
import { EditableItem } from '../../controls/EditableItem/EditableItem';

class BaseCampInfoEdit extends React.Component {

    TRANSLATE_PREFIX = 'camps:camp.edit.info';

    state = {
        editedCamp: {...this.props.camp}
    };

    save() {
        this.props.onSave(this.state.editedCamp);
    }

    propertyChanged(prop, value, parsingFn) {
        if (!prop || !this.state.editedCamp[prop]) {
            console.warn(`Property ${prop} doesn't exist on camp model! maybe the model changed`);
        }
        if (parsingFn && parsingFn.constructor && parsingFn.call && parsingFn.apply) {
            value = parsingFn(value)
        }
        const editedCamp = {...this.state.editedCamp, [prop]: value};
        this.setState({editedCamp});
    }

    parseCampStatus(value) {
        // Until we fix camps model to save this as boolean
        return !!value ? 'open' : 'close';
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <Row>
                    <Col xs="12" className="mt-3 mb-3">
                        <h4 className="h4-responsive">{t(`${this.TRANSLATE_PREFIX}.nameTitle`)}</h4>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md="6">
                                <Col xs="12">
                                    <EditableItem title={`${t('name')} (${t('hebrew')})`}
                                                  editMode={true}
                                                  value={this.state.editedCamp.camp_name_he}
                                                  onChange={(e) => this.propertyChanged('camp_name_he', e.target.value)}/>
                                </Col>
                                <Col xs="12">
                                    <EditableItem title={`${t('description')} (${t('hebrew')})`}
                                                  type="textarea"
                                                  editMode={true}
                                                  value={this.state.editedCamp.camp_desc_he}
                                                  onChange={(e) => this.propertyChanged('camp_desc_he', e.target.value)}/>
                                </Col>
                            </Col>
                            <Col md="6">
                                <Col xs="12">
                                    <EditableItem title={`${t('name')} (${t('english')})`}
                                                  editMode={true}
                                                  value={this.state.editedCamp.camp_name_en}
                                                  onChange={(e) => this.propertyChanged('camp_name_en', e.target.value)}/>
                                </Col>
                                <Col xs="12">
                                    <EditableItem title={`${t('description')} (${t('english')})`}
                                                  type="textarea"
                                                  editMode={true}
                                                  onChange={(e) => this.propertyChanged('camp_desc_en', e.target.value)}
                                                  value={this.state.editedCamp.camp_desc_en}/>
                                </Col>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <Col xs="12" className="mt-3 mb-3">
                        <h4 className="h4-responsive">{t(`${this.TRANSLATE_PREFIX}.publicationTitle`)}</h4>
                    </Col>
                    <Card className="w-100">
                        <CardBody>
                            <Row>
                                <Col md="8">
                                    <EditableItem title={t(`${this.TRANSLATE_PREFIX}.facebookLink`)}
                                                  editMode={true}
                                                  value={this.state.editedCamp.facebook_page_url}
                                                  onChange={(e) => this.propertyChanged('facebook_page_url', e.target.value)}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <EditableItem title={t(`${this.TRANSLATE_PREFIX}.contactPerson`, {type: t('name')})}
                                                  editMode={true}
                                                  value={this.state.editedCamp.contact_person_name}
                                                  onChange={(e) => this.propertyChanged('contact_person_name', e.target.value)}/>
                                </Col>
                                <Col md="4">
                                    <EditableItem title={t(`${this.TRANSLATE_PREFIX}.contactPerson`, {type: t('email')})}
                                                  editMode={true}
                                                  value={this.state.editedCamp.contact_person_email}
                                                  onChange={(e) => this.propertyChanged('contact_person_email', e.target.value)}/>
                                </Col>
                                <Col md="4">
                                    <EditableItem title={t(`${this.TRANSLATE_PREFIX}.contactPerson`, {type: t('phone')})}
                                                  editMode={true}
                                                  value={this.state.editedCamp.contact_person_phone}
                                                  onChange={(e) => this.propertyChanged('contact_person_phone', e.target.value)}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <EditableItem title={t(`${this.TRANSLATE_PREFIX}.campsOpen`)}
                                                  type="checkbox"
                                                  editMode={true}
                                                  value={this.state.editedCamp.status === 'open'}
                                                  onChange={(e) => this.propertyChanged('status', e.target.checked, this.parseCampStatus)}/>
                                </Col>
                                <Col md="4">
                                    <EditableItem title={t(`${this.TRANSLATE_PREFIX}.acceptFamilies`)}
                                                  type="checkbox"
                                                  editMode={true}
                                                  value={this.state.editedCamp.accept_families}
                                                  onChange={(e) => this.propertyChanged('accept_families', e.target.checked)}/>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row>
                    <Col xs="12" className="mt-3 mb-3">
                        <h4 className="h4-responsive">{t(`${this.TRANSLATE_PREFIX}.contactsTitle`)}</h4>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row>
                            {/*TODO - GET MEMBERS!*/}
                            <Col md="4">
                                <EditableItem title={t(`${this.TRANSLATE_PREFIX}.mainContact`)}
                                              type="options"
                                              editMode={true}
                                              options={[]}
                                              value={this.state.editedCamp.contact_person_phone}
                                              onChange={(e) => this.propertyChanged('contact_person_phone', e.target.contact_person_phone)}/>
                            </Col>
                            <Col md="4">
                                <EditableItem title={t(`${this.TRANSLATE_PREFIX}.moopContact`)}
                                              type="options"
                                              editMode={true}
                                              options={[]}
                                              value={this.state.editedCamp.contact_person_phone}
                                              onChange={(e) => this.propertyChanged('contact_person_phone', e.target.contact_person_phone)}/>
                            </Col>
                            <Col md="4">
                                <EditableItem title={t(`${this.TRANSLATE_PREFIX}.safetyContact`)}
                                              type="options"
                                              editMode={true}
                                              options={[]}
                                              value={this.state.editedCamp.contact_person_phone}
                                              onChange={(e) => this.propertyChanged('contact_person_phone', e.target.contact_person_phone)}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }

}

export const CampBasicInfo = withI18n()(BaseCampInfoEdit);