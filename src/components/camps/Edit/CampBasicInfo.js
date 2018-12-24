import React from 'react';
import { withI18n } from 'react-i18next';
import { Col } from 'mdbreact';
import { TextInput } from '../../controls/EditableItem/TextInput';
import { TextAreaInput } from '../../controls/EditableItem/TextAreaInput';

class BaseCampInfoEdit extends React.Component {

    TRANSLATE_PREFIX = 'campspage.edit.infoEdit';

    state = {
        editedCamp: {...this.props.camp}
    };

    save() {
        this.props.onSave(this.state.editedCamp);
    }

    propertyChanged(prop, value) {
        console.log({prop, value, camp: this.state.editedCamp[prop]})
        if (!prop || !this.state.editedCamp[prop]) {
            console.warn(`Property ${prop} doesn't exist on camp model! maybe the model changed`);
        }
        const editedCamp = {...this.state.editedCamp, [prop]: value };
        this.setState({editedCamp});
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <h4 className="h4-responsive">{t(`${this.TRANSLATE_PREFIX}.nameTitle`)}</h4>
                <Col xs="12">
                    <TextInput title={`${t('name')} (${t('hebrew')})`}
                               value={this.state.editedCamp.camp_name_he}
                               onChange={(e) => this.propertyChanged('camp_name_he', e.target.value)}/>
                </Col>
                <Col xs="12">
                    <TextAreaInput title={`${t('description')} (${t('hebrew')})`}
                                   value={this.state.editedCamp.camp_desc_he}
                                   onChange={(e) => this.propertyChanged('camp_desc_he', e.target.value)}/>
                </Col>
                <Col xs="12">
                    <TextInput title={`${t('name')} (${t('english')})`}
                               value={this.state.editedCamp.camp_name_en}
                               onChange={(e) => this.propertyChanged('camp_name_en', e.target.value)}/>
                </Col>
                <Col xs="12">
                    <TextAreaInput title={`${t('description')} (${t('english')})`}
                                   onChange={(e) => this.propertyChanged('camp_desc_en', e.target.value)}
                                   value={this.state.editedCamp.camp_desc_en}/>
                </Col>
                <h4 className="h4-responsive">{t(`${this.TRANSLATE_PREFIX}.publicationTitle`)}</h4>
                <Col xs="12">
                    <TextInput title={t(`${this.TRANSLATE_PREFIX}.facebookLink`)}
                               value={this.state.editedCamp.facebook_page_url}
                               onChange={(e) => this.propertyChanged('facebook_page_url', e.target.facebook_page_url)}/>
                </Col>
                <Col xs="12">
                    <TextInput title={t(`${this.TRANSLATE_PREFIX}.contactPerson`, {type: t('name')})}
                               value={this.state.editedCamp.contact_person_name}
                               onChange={(e) => this.propertyChanged('contact_person_name', e.target.contact_person_name)}/>
                </Col>
                <Col xs="12">
                    <TextInput title={t(`${this.TRANSLATE_PREFIX}.contactPerson`, {type: t('email')})}
                               value={this.state.editedCamp.contact_person_email}
                               onChange={(e) => this.propertyChanged('contact_person_email', e.target.contact_person_email)}/>
                </Col>
                <Col xs="12">
                    <TextInput title={t(`${this.TRANSLATE_PREFIX}.contactPerson`, {type: t('phone')})}
                               value={this.state.editedCamp.contact_person_phone}
                               onChange={(e) => this.propertyChanged('contact_person_phone', e.target.contact_person_phone)}/>
                </Col>
                {/*SELECTION ICONS FOR OPEN CAMPS AND NEW MEMBERS*/}
            </div>
        )
    }

};

export const CampBasicInfo = withI18n()(BaseCampInfoEdit);