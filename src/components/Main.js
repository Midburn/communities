import { AppNavigation } from './AppNavigation';
import { Col, Container, Card, Row, CardBody } from 'mdbreact';
import { AppBreadcrumbs } from './AppBreadcrumbs';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Home } from './Home';
import { Camps } from './camps/Camps';
import { Arts } from './Arts';
import { NotFound } from './NotFound';
import React from 'react';
import { withI18n } from 'react-i18next';
import { Camp } from './camps/Camp';

const BaseMain = (props) => {
    const {lng} = props;
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
                                    <Route path="/" component={Home} exact/>
                                    <Route path="/camps" component={Camps} exact/>
                                    <Route path="/camps/:id" component={Camp}/>
                                    <Route path="/arts" component={Arts}/>
                                    <Route component={NotFound}/>
                                </Switch>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};

export const Main = withI18n()(withRouter(props => <BaseMain {...props}/>));