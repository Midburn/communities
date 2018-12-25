import React from 'react';
import { withI18n } from 'react-i18next';
import { Col } from 'mdbreact';
import { EditableItem } from '../../controls/EditableItem/EditableItem';

class BaseCampDetailsEdit extends React.Component {

    TRANSLATE_PREFIX = 'camps:camp.edit.info';

    state = {
        editedCamp: {...this.props.camp}
    };

    save() {
        this.props.onSave(this.state.editedCamp);
    }

    propertyChanged(prop, value) {
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

            </div>
        )
    }

}

export const CampBasicDetails = withI18n()(BaseCampDetailsEdit);