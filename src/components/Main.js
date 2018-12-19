import { AppNavigation } from './AppNavigation';
import { Col, Container, Card, Row, CardBody } from 'mdbreact';
import { AppBreadcrumbs } from './AppBreadcrumbs';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Home } from './Home';
import { Camps } from './Camps';
import { Arts } from './Arts';
import { NotFound } from './NotFound';
import React from 'react';
import { withI18n } from 'react-i18next';

const BaseMain = (props) => {
    const { lng } = props;
    return (
        <div>
            <AppNavigation />
            <Container className={lng === 'he' ? 'rtl' : ''}>
                <Row>
                    <Col>
                        <AppBreadcrumbs />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card >
                            <CardBody>
                                <Switch>
                                    <Route path="/" component={Home} exact />
                                    <Route path="/camps" component={Camps}/>
                                    <Route path="/arts" component={Arts}/>
                                    <Route component={NotFound}/>
                                </Switch>
                            </CardBody>
                        </Card >
                    </Col>
                </Row>
            </Container>
        </div>
    )
};

export const Main = withI18n()(withRouter(props => <BaseMain {...props}/>));