import React from 'react';
import { FormInline, Fa, Input, Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { GroupList } from './GroupList';
import { state } from '../../models/state';
import * as constants from '../../../models/constants';

@observer
class BaseGroups extends React.Component {

    query = '';

    @action
    handleChange = (e) => {
        this.query = e.target.value;
    };

    getTranslatePath(type) {
        return `${type}:`;
    }

    @computed
    get listData() {
        const {match} = this.props;
        const type = match.params.groupType;
        return type.includes(constants.GROUP_TYPES.CAMP) ? state.camps : state.artInstallations
    }

    render() {
        const {t, match} = this.props;
        const type = match.params.groupType;
        return (
            <div>
                <Row>
                    <Col md="12">
                        <h1>{t(`${this.getTranslatePath(type)}search.title`)}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormInline  onSubmit={(e) => {e.preventDefault()}} className="md-form">
                            <Input
                                className="form-control form-control-sm ml-3"
                                type="text"
                                hint={t(`${this.getTranslatePath(type)}search.title`)}
                                placeholder={t(`${this.getTranslatePath(type)}search.title`)}
                                aria-label={t(`${this.getTranslatePath(type)}search.title`)}
                                onChange={this.handleChange}
                            />
                            <Fa icon="search"/>
                        </FormInline>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <GroupList query={this.query} groups={this.listData} />
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Groups = withI18n()(BaseGroups);