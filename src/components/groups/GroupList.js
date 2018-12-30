import React from 'react';
import { withI18n } from 'react-i18next';
import { Card, CardImage, CardBody, CardText, CardTitle, Button, Alert } from 'mdbreact';
import './GroupList.scss';
import { observer } from 'mobx-react';
import FlipMove from 'react-flip-move';
import { withRouter } from 'react-router-dom';
import { JoinGroupModal } from './JoinGroupModal';
import { observable } from 'mobx';
import { GroupsService } from '../../services/groups';

@observer
class BaseGroupList extends React.Component {

    groupsService = new GroupsService();

    @observable
    isJoinCampModal = false;

    @observable
    selectedCamp;

    filter = (camp) => {
        let {query} = this.props;
        query = query.toLowerCase();
        if (!query || !query.length) {
            // No query given - should return all camps
            return true;
        }
        return this.matchName(camp, query);
    };

    matchName(camp, q) {
        const heb = camp.camp_name_he || '';
        const en = camp.camp_name_en || '';
        return heb.toLowerCase().includes(q) || en.toLowerCase().includes(q);
    }

    viewGroup = (id) => {
        const {history, match} = this.props;
        history.push({pathname: `${match.params.groupType}/${id}` });
    };

    joinCamp = (id) => {
        this.selectedGroup = this.props.groups.find(g => g.id === id);
        this.isJoinCampModal = true;
    };

    toggle = () => {
        this.isJoinCampModal = !this.isJoinCampModal;
    };

    render() {
        const {groups, t, query, match} = this.props;
        const filteredGroups = groups.filter(this.filter);
        return (
            <div>
                <JoinGroupModal isOpen={this.isJoinCampModal} group={this.selectedGroup} toggle={this.toggle}/>
                <FlipMove className="CampList">
                    { filteredGroups.length ? null : <Alert className="w-100" color="danger" >{t(`${match.params.groupType}:search.notFound`, { q: query})}</Alert>}
                    {filteredGroups.map(group => {
                        return (
                            <Card key={group.id} className="CampResult">
                                <CardImage
                                    className="img-fluid"
                                    src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
                                    hover
                                />
                                <CardBody>
                                    <CardTitle>{this.groupsService.getPropertyByLang(group, 'name')}</CardTitle>
                                    <CardText>
                                        {this.groupsService.getPropertyByLang(group, 'description')}
                                    </CardText>
                                    <Button onClick={() => this.viewGroup(group.id)}>{t('view')}</Button>
                                    <Button onClick={() => this.joinCamp(group.id)}>{t('join')}</Button>
                                </CardBody>
                            </Card>
                        );
                    })}
                </FlipMove>
            </div>
        )
    }
}

export const GroupList = withRouter(withI18n()(BaseGroupList));