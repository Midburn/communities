import React from 'react';
import { AppNavigation } from './navigation/AppNavigation';
import { Col, Container, Card, Row, CardBody } from 'mdbreact';
import { AppBreadcrumbs } from './navigation/AppBreadcrumbs';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Groups } from './camps/Groups';
import { withI18n } from 'react-i18next';
import { Group } from './camps/Group';
import i18n from '../services/i18n';
import { GroupManagement } from './camps/Edit/GroupManagement';

class BaseMain extends React.Component {

    constructor(props) {
        super(props);
        const lng = props.match.params.lng;
        if (!lng || !['he', 'en'].includes(lng)) {
           // window.location.href = '/he';
        }
        i18n.changeLanguage(lng);
    }

    render () {
        const {lng} = this.props;
        return (
            <div className="Main">
                <AppNavigation/>
                <Container fluid={window.innerWidth < 1200} className={`${lng === 'he' ? 'rtl' : ''} MainContainer`}>
                    <Row>
                        <Col>
                            <AppBreadcrumbs/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardBody className="MainPanel">
                                    <Switch>
                                        <Route path="/:lng(en|he)/:groupType" component={Groups} exact/>
                                        <Route path="/:lng(en|he)/:groupType/:id" component={Group} exact/>
                                        <Route path="/:lng(en|he)/:groupType/:id/manage" component={GroupManagement} exact/>
                                    </Switch>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export const Main = withI18n()(withRouter(props => <BaseMain {...props}/>));