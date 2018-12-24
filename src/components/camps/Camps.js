import React from 'react';
import { FormInline, Fa, Input, Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { CampList } from './CampList';
import { mockcamps } from './mockcamps';

@observer
class BaseCamps extends React.Component {

    @observable
    query = '';

    @observable
    camps = mockcamps;

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
                        <h1>{t('campspage.title')}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormInline  onSubmit={(e) => {e.preventDefault()}} className="md-form">
                            <Input
                                className="form-control form-control-sm ml-3"
                                type="text"
                                hint={t('campspage.search')}
                                placeholder={t('campspage.search')}
                                aria-label={t('campspage.search')}
                                onChange={this.handleChange}
                            />
                            <Fa icon="search"/>
                        </FormInline>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CampList query={this.query} camps={this.camps}/>
                    </Col>
                </Row>
            </div>

        );
    }
}

export const Camps = withI18n()(BaseCamps);