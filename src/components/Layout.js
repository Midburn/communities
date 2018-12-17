import React from 'react';
import { Arts } from './Arts';
import { NotFound } from './NotFound';
import { Home } from './Home';
import { Camps } from './Camps';
import { Col, Grid, Panel, Row } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { AppBreadcrumbs } from './AppBreadcrumbs';

export const Layout = () => {
    return (
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
    );
};
