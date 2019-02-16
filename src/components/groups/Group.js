import React from 'react';
import {Col, Row} from 'mdbreact';
import {withI18n} from 'react-i18next';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {GroupHeader} from './GroupHeader';
import {ButtonGroup} from '../controls/ButtonGroup';
import './Group.scss';
import {GroupBasicInfo} from './Edit/GroupBasicInfo';
import {GroupPublicationDetails} from './GroupPublicationDetails';
import {
  PermissableComponent,
} from '../../components/controls/PermissableComponent';
import {PermissionService} from '../../services/permissions';
import {GroupMembers} from './Edit/GroupMembers';
import {Tabs} from '../controls/Tabs';
import {GroupsService} from '../../services/groups';
import {EventRulesService} from '../../services/event-rules';
import {ParsingService} from '../../services/parsing';

@observer class BaseGroup extends React.Component {
  permissionService = new PermissionService ();
  groupService = new GroupsService ();
  eventRulesService = new EventRulesService ();
  parsingService = new ParsingService ();
  error = null;

  @observable editMode = false;
  @observable group = {};
  @observable activeTab = 1;

  edit = () => {
    this.editMode = true;
    this.editMode = true;
    this.buttons = [this.viewButton];
    this.props.history.push ({search: '?edit=true'});
  };

  view = () => {
    this.editMode = false;
    this.buttons = [this.editButton];
    this.props.history.push ({search: ''});
  };

  setActiveTab (tab) {
    tab = +tab;
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.props.history.push ({
        hash: `#${tab}`,
        search: this.props.location.search,
      });
    }
  }

  editButton = {
    icon: 'pencil',
    onClick: this.edit,
    tooltip: this.props.t ('edit'),
  };

  viewButton = {
    icon: 'eye',
    onClick: this.view,
    tooltip: this.props.t ('view'),
  };

  buttons = [this.editButton];

  constructor (props) {
    super (props);
    this.getGroupData (props);
    if (this.props.location.search.includes ('edit=true')) {
      this.edit ();
    }
    if (this.props.location.hash) {
      this.setActiveTab (this.props.location.hash.replace ('#', ''));
    }
  }

  componentWillReceiveProps (props) {
    this.getGroupData (props);
  }

  async getGroupData (props) {
    const {match} = props;
    try {
      const group = await this.groupService.getGroup (match.params.id);
      if (!group) {
        // TODO - 404 group not found
        return;
      }
      this.group = group;
    } catch (e) {
      this.error = e;
    }
  }

  get memberTabs () {
    const {match, t} = this.props;
    return [
      {
        id: 1,
        title: t (`${match.params.groupType}:single.edit.tabs.info`),
        component: (
          <GroupPublicationDetails key={1} group={this.group} match={match} />
        ),
      },
      {
        id: 2,
        title: t (`${match.params.groupType}:single.edit.tabs.members`),
        component: (
          <GroupMembers
            group={this.group}
            match={match}
            key={2}
            members={this.group.members}
          />
        ),
      },
    ];
  }

  get isGroupEditable () {
    const {match} = this.props;
    return (
      this.permissionService.isAdmin () ||
      (this.permissionService.canEditThisGroup (this.group) &&
        !this.eventRulesService.isGroupEditingDisabled (
          this.parsingService.getGroupTypeFromString (match.params.groupType)
        ))
    );
  }

  render () {
    const {lng, match} = this.props;
    const MemberView = this.editMode
      ? <GroupBasicInfo group={this.group} onSave={this.saveChanges} />
      : <Tabs
          tabs={this.memberTabs}
          selectedId={this.activeTab}
          onSelect={e => this.setActiveTab (e)}
        />;
    const BasicView = this.editMode
      ? <GroupBasicInfo group={this.group} onSave={this.saveChanges} />
      : <GroupPublicationDetails match={match} group={this.group} />;
    return (
      <div className="CampView">
        <Row>
          <Col md="12">
            <PermissableComponent permitted={this.isGroupEditable}>
              <div className={`ButtonGroup ${lng === 'he' ? 'left' : 'right'}`}>
                <ButtonGroup buttons={this.buttons} vertical={true} />
              </div>
            </PermissableComponent>
            <GroupHeader group={this.group} editMode={this.editMode} />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {(this.permissionService.isGroupMember (this.group.id) ||
              this.permissionService.isAdmin ()) &&
              !!this.group.members
              ? MemberView
              : BasicView}
          </Col>
        </Row>
      </div>
    );
  }
}

export const Group = withRouter (withI18n () (BaseGroup));
