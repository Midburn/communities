import React from 'react';
import {withI18n} from 'react-i18next';
import {Col, Row, Card, CardBody} from 'mdbreact';
import {EditableItem} from '../../controls/EditableItem/EditableItem';
import {withRouter} from 'react-router-dom';
import * as constants from '../../../../models/constants';
import {Loader} from '../../Loader';

class BaseGroupInfoEdit extends React.Component {
  get TRANSLATE_PREFIX () {
    const {match} = this.props;
    return `${match.params.groupType}:single.edit.info`;
  }

  state = {};

  componentWillMount () {
    this.setState ({
      editedGroup: {...this.props.group},
    });
  }

  componentDidUpdate () {
    if (!this.props.group) {
      return;
    }
    if (
      this.state.editedGroup &&
      this.state.editedGroup.id === this.props.group.id
    ) {
      return;
    }
    this.setState ({
      editedGroup: {...this.props.group},
    });
  }

  save () {
    this.props.onSave (this.state.editedGroup);
  }

  propertyChanged (prop, value, parsingFn) {
    if (!prop || !this.state.editedGroup[prop]) {
      console.warn (
        `Property ${prop} doesn't exist on camp model! maybe the model changed`
      );
    }
    if (
      parsingFn &&
      parsingFn.constructor &&
      parsingFn.call &&
      parsingFn.apply
    ) {
      value = parsingFn (value);
    }
    const editedGroup = {...this.state.editedGroup, [prop]: value};
    this.setState ({editedGroup});
  }

  parseCampStatus (value) {
    // Until we fix camps model to save this as boolean
    return !!value ? 'open' : 'close';
  }

  getContactPersonProp (propName) {
    if (!this.editedGroup || !this.editedGroup.members) {
      return '';
    }
    const member = this.editedGroup.members.find (
      member => member.role === constants.GROUP_STATIC_ROLES.CONTACT
    );
    if (member) {
      return member[propName];
    }
    return '';
  }

  render () {
    const {t, group} = this.props;
    if (!group || !this.state.editedGroup) {
      return <Loader />;
    }
    return (
      <div>
        <Row>
          <Col xs="12" className="mt-3 mb-3">
            <h4 className="h4-responsive">
              {t (`${this.TRANSLATE_PREFIX}.nameTitle`)}
            </h4>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              <Col md="6">
                <Col xs="12">
                  <EditableItem
                    title={`${t ('name')} (${t ('hebrew')})`}
                    editMode={true}
                    value={this.state.editedGroup.group_name_he}
                    onChange={e =>
                      this.propertyChanged ('group_name_he', e.target.value)}
                  />
                </Col>
                <Col xs="12">
                  <EditableItem
                    title={`${t ('description')} (${t ('hebrew')})`}
                    type="textarea"
                    editMode={true}
                    value={this.state.editedGroup.group_desc_he}
                    onChange={e =>
                      this.propertyChanged ('group_desc_he', e.target.value)}
                  />
                </Col>
              </Col>
              <Col md="6">
                <Col xs="12">
                  <EditableItem
                    title={`${t ('name')} (${t ('english')})`}
                    editMode={true}
                    value={this.state.editedGroup.group_name_en}
                    onChange={e =>
                      this.propertyChanged ('group_name_en', e.target.value)}
                  />
                </Col>
                <Col xs="12">
                  <EditableItem
                    title={`${t ('description')} (${t ('english')})`}
                    type="textarea"
                    editMode={true}
                    onChange={e =>
                      this.propertyChanged ('group_desc_en', e.target.value)}
                    value={this.state.editedGroup.group_desc_en}
                  />
                </Col>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Col xs="12" className="mt-3 mb-3">
          <h4 className="h4-responsive">
            {t (`${this.TRANSLATE_PREFIX}.publicationTitle`)}
          </h4>
        </Col>
        <Card className="w-100">
          <CardBody>
            <Col md="12">
              <Row>
                <Col md="8">
                  <EditableItem
                    title={t (`${this.TRANSLATE_PREFIX}.facebookLink`)}
                    editMode={true}
                    value={this.state.editedGroup.facebook_url}
                    onChange={e =>
                      this.propertyChanged ('facebook_url', e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <EditableItem
                    title={t (`${this.TRANSLATE_PREFIX}.contactPerson`, {
                      type: t ('name'),
                    })}
                    editMode={true}
                    value={this.getContactPersonProp ('name')}
                    onChange={e =>
                      this.propertyChanged (
                        'contact_person_name',
                        e.target.value
                      )}
                  />
                </Col>
                <Col md="4">
                  <EditableItem
                    title={t (`${this.TRANSLATE_PREFIX}.contactPerson`, {
                      type: t ('email'),
                    })}
                    editMode={true}
                    value={this.getContactPersonProp ('email')}
                    onChange={e =>
                      this.propertyChanged (
                        'contact_person_email',
                        e.target.value
                      )}
                  />
                </Col>
                <Col md="4">
                  <EditableItem
                    title={t (`${this.TRANSLATE_PREFIX}.contactPerson`, {
                      type: t ('phone'),
                    })}
                    editMode={true}
                    value={this.getContactPersonProp ('cell_phone')}
                    onChange={e =>
                      this.propertyChanged (
                        'contact_person_phone',
                        e.target.value
                      )}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <EditableItem
                    title={t (`${this.TRANSLATE_PREFIX}.campsOpen`)}
                    type="checkbox"
                    editMode={true}
                    value={
                      this.state.editedGroup.group_stauts ===
                        constants.GROUP_STATUS.OPEN
                    }
                    onChange={e =>
                      this.propertyChanged (
                        'status',
                        e.target.checked,
                        this.parseCampStatus
                      )}
                  />
                </Col>
                <Col md="4">
                  <EditableItem
                    title={t (`${this.TRANSLATE_PREFIX}.acceptFamilies`)}
                    type="checkbox"
                    editMode={true}
                    value={+this.state.editedGroup.accept_families || false}
                    onChange={e =>
                      this.propertyChanged (
                        'accept_families',
                        e.target.checked
                      )}
                  />
                </Col>
              </Row>
            </Col>
          </CardBody>
        </Card>
        <Row>
          <Col xs="12" className="mt-3 mb-3">
            <h4 className="h4-responsive">
              {t (`${this.TRANSLATE_PREFIX}.contactsTitle`)}
            </h4>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              {/*TODO - GET MEMBERS!*/}
              <Col md="4">
                <EditableItem
                  title={t (`${this.TRANSLATE_PREFIX}.mainContact`)}
                  type="options"
                  editMode={true}
                  options={[]}
                  value={this.state.editedGroup.contact_person_phone}
                  onChange={e =>
                    this.propertyChanged (
                      'contact_person_phone',
                      e.target.contact_person_phone
                    )}
                />
              </Col>
              <Col md="4">
                <EditableItem
                  title={t (`${this.TRANSLATE_PREFIX}.moopContact`)}
                  type="options"
                  editMode={true}
                  options={[]}
                  value={this.state.editedGroup.contact_person_phone}
                  onChange={e =>
                    this.propertyChanged (
                      'contact_person_phone',
                      e.target.contact_person_phone
                    )}
                />
              </Col>
              <Col md="4">
                <EditableItem
                  title={t (`${this.TRANSLATE_PREFIX}.safetyContact`)}
                  type="options"
                  editMode={true}
                  options={[]}
                  value={this.state.editedGroup.contact_person_phone}
                  onChange={e =>
                    this.propertyChanged (
                      'contact_person_phone',
                      e.target.contact_person_phone
                    )}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export const GroupBasicInfo = withRouter (withI18n () (BaseGroupInfoEdit));
