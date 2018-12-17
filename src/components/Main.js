import { AppNavigation } from './AppNavigation';
import { Col, Grid, Panel, Row } from 'react-bootstrap';
import { AppBreadcrumbs } from './AppBreadcrumbs';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Camps } from './Camps';
import { Arts } from './Arts';
import { NotFound } from './NotFound';
import React from 'react';

export const Main = () => {
    return (
        <div>
            <AppNavigation />
            <Grid>
                <Row>
                    <Col xs={12}>
                        <AppBreadcrumbs />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Panel>
                            <Panel.Body>
                                <Switch>
                                    <Route path="/" component={Home} exact />
                                    <Route path="/camps" component={Camps}/>
                                    <Route path="/arts" component={Arts}/>
                                    <Route component={NotFound}/>
                                </Switch>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        </div>
    )
};
