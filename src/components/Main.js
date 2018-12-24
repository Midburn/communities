import { AppNavigation } from './AppNavigation';
import { Col, Container, Card, Row, CardBody } from 'mdbreact';
import { AppBreadcrumbs } from './AppBreadcrumbs';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Home } from './Home';
import { Camps } from './camps/Camps';
import { Arts } from './Arts';
import React from 'react';
import { withI18n } from 'react-i18next';
import { Camp } from './camps/Camp';
import i18n from '../services/i18n';

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
                                        {/*<Route exact path="/:lng(en|he)/home" component={Home}/>*/}
                                        <Route path="/:lng(en|he)/camps" component={Camps} exact/>
                                        <Route path="/:lng(en|he)/camps/:id" component={Camp}/>
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