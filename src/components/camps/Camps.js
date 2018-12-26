import React from 'react';
import { FormInline, Fa, Input, Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { CampList } from './CampList';
import { state } from '../../models/state';
@observer
class BaseCamps extends React.Component {

    @observable
    query = '';

    @action
    handleChange = (e) => {
        this.query = e.target.value;
    };

    render() {
        const {t} = this.props;
        return (
            <div>
                <Row>
                    <Col md="12">
                        <h1>{t('camps:search.title')}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormInline  onSubmit={(e) => {e.preventDefault()}} className="md-form">
                            <Input
                                className="form-control form-control-sm ml-3"
                                type="text"
                                hint={t('camps:search.title')}
                                placeholder={t('camps:search.title')}
                                aria-label={t('camps:search.title')}
                                onChange={this.handleChange}
                            />
                            <Fa icon="search"/>
                        </FormInline>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CampList query={this.query} camps={state.camps}/>
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Camps = withI18n()(BaseCamps);