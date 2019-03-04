import React from 'react';
import {FormInline, Fa, Input, Col, Row} from 'mdbreact';
import {withI18n} from 'react-i18next';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import {GroupList} from './GroupList';
import * as constants from '../../../models/constants';
import {GroupsService} from '../../services/groups';

@observer class BaseGroups extends React.Component {
  groupsService = new GroupsService ();
  query = '';

  @observable groups = [];

  @action handleChange = e => {
    this.query = e.target.value;
  };

  getTranslatePath (type) {
    return `${type}:`;
  }

  constructor (props) {
    super (props);
    this.init (props);
  }

  componentWillReceiveProps (props) {
    if (!this.isLoading) {
      this.init (props);
    }
  }

  async init (props) {
    try {
      this.isLoading = true;
      const {match} = props;
      /**
         * Put all requests for initial business logic data here (logged user, event rules etc...).
         */
      const type = match.params.groupType;
      this.groups = type.includes (constants.GROUP_TYPES.CAMP)
        ? await this.groupsService.getAllOpenGroups (constants.GROUP_TYPES.CAMP)
        : await this.groupsService.getAllOpenGroups (constants.GROUP_TYPES.ART);
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      // TODO - what do we do with errors?
      this.error = e;
    }
  }

  render () {
    const {t, match} = this.props;
    const type = match.params.groupType;
    return (
      <div>
        <Row>
          <Col md="12">
            <h1>{t (`${this.getTranslatePath (type)}search.title`)}</h1>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormInline
              onSubmit={e => {
                e.preventDefault ();
              }}
              className="md-form"
            >
              <Input
                className="form-control form-control-sm ml-3"
                type="text"
                hint={t (`${this.getTranslatePath (type)}search.title`)}
                placeholder={t (`${this.getTranslatePath (type)}search.title`)}
                aria-label={t (`${this.getTranslatePath (type)}search.title`)}
                onChange={this.handleChange}
              />
              <Fa icon="search" />
            </FormInline>
          </Col>
        </Row>
        <Row>
          <Col>
            <GroupList query={this.query} groups={this.groups} />
          </Col>
        </Row>
      </div>
    );
  }
}

export const Groups = withI18n () (BaseGroups);
