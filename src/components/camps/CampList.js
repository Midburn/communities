import React from 'react';
import { withI18n } from 'react-i18next';
import { Card, CardImage, CardBody, CardText, CardTitle, Button, Alert } from 'mdbreact';
import './CampList.scss';
import { observer } from 'mobx-react';
import FlipMove from 'react-flip-move';
import { withRouter } from 'react-router-dom';
import { JoinCampModal } from './JoinCampModal';
import { observable } from 'mobx';
import { CampsService } from '../../services/camps';

@observer
class BaseCampList extends React.Component {

    campService = new CampsService();

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

    viewCamp = (id) => {
        const {history} = this.props;
        history.push({pathname: `camps/${id}` });
    };

    joinCamp = (id) => {
        this.selectedCamp = this.props.camps.find(camp => camp.id === id);
        this.isJoinCampModal = true;
    };

    toggle = () => {
        this.isJoinCampModal = !this.isJoinCampModal;
    };

    render() {
        const {camps, t, query} = this.props;
        const filteredCamps = camps.filter(this.filter);
        return (
            <FlipMove className="CampList">
                <JoinCampModal isOpen={this.isJoinCampModal} camp={this.selectedCamp} toggle={this.toggle}/>
                { filteredCamps.length ? null : <Alert color="danger w-100" >{t('camps:search.notFound', { q: query})}</Alert>}
                {filteredCamps.map(camp => {
                    return (
                        <Card className="CampResult">
                            <CardImage
                                className="img-fluid"
                                src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
                                onerror="this.onerror=null;this.src='imagefound.gif';"
                                hover
                            />
                            <CardBody>
                                <CardTitle>{this.campService.getPropertyByLang(camp, 'name')}</CardTitle>
                                <CardText>
                                    {this.campService.getPropertyByLang(camp, 'description')}
                                </CardText>
                                <Button onClick={() => this.viewCamp(camp.id)}>{t('view')}</Button>
                                <Button onClick={() => this.joinCamp(camp.id)}>{t('join')}</Button>
                            </CardBody>
                        </Card>
                    );
                })}
            </FlipMove>
        )
    }
}

export const CampList = withRouter(withI18n()(BaseCampList));