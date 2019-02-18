import React from 'react';
import {AppNavigation} from './navigation/AppNavigation';
import {Col, Container, Card, Row, CardBody} from 'mdbreact';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {Groups} from './groups/Groups';
import {withI18n} from 'react-i18next';
import {Group} from './groups/Group';
import i18n from '../services/i18n';
import {CreateGroup} from './groups/CreateGroup';
import {GroupManagement} from './groups/Edit/GroupManagement';
import {PresaleAdmin} from './allocations/PresaleAdmin';
import {PresaleGroupLeader} from './allocations/PresaleGroupLeader';
import {GroupsManagement} from './groups/GroupsManagement';
import {PrivateRoute} from './navigation/PrivateRoute';
import {PermissionService} from '../services/permissions';
import {ImportGroups} from './groups/ImportGroups';

class BaseMain extends React.Component {
  permissionService = new PermissionService ();

  constructor (props) {
    super (props);
    const lng = props.match.params.lng;
    i18n.changeLanguage (lng);
  }

  render () {
    const {lng} = this.props;
    return (
      <div className="Main">
        <AppNavigation />
        <Container
          fluid={window.innerWidth < 1200}
          className={`${lng === 'he' ? 'rtl' : ''} MainContainer`}
        >
          <Row>
            <Col />
          </Row>
          <Row>
            <Col>
              <Card>
                <CardBody className="MainPanel">
                  <Switch>
                    <Route
                      path="/:lng(en|he)/:groupType"
                      component={Groups}
                      exact
                    />
                    <PrivateRoute
                      permit={this.permissionService.allowedToAllocateQuota}
                      path="/:lng(en|he)/:groupType/allocations"
                      component={PresaleAdmin}
                      exact
                    />
                    <Route
                      path="/:lng(en|he)/:groupType/create"
                      component={CreateGroup}
                      exact
                    />
                    <Route
                      path="/:lng(en|he)/:groupType/management"
                      component={GroupsManagement}
                      exact
                    />
                    <Route
                      path="/:lng(en|he)/:groupType/management/import"
                      component={ImportGroups}
                      exact
                    />
                    <Route
                      path="/:lng(en|he)/:groupType/:id/allocations"
                      component={PresaleGroupLeader}
                      exact
                    />
                    <Route
                      path="/:lng(en|he)/:groupType/:id"
                      component={Group}
                      exact
                    />
                    <Route
                      path="/:lng(en|he)/:groupType/:id/manage"
                      component={GroupManagement}
                      exact
                    />
                    <Redirect path="/" to="/he/camps" exact />
                  </Switch>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export const Main = withI18n () (withRouter (props => <BaseMain {...props} />));
