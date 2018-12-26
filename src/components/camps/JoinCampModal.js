import React from 'react';
import { withI18n } from 'react-i18next';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'mdbreact';
import './CampList.scss';
import { withRouter } from 'react-router-dom';
import { GroupsService } from '../../services/groups';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './JoinCampModal.scss';

@observer
class BaseJoinCampModal extends React.Component {

    groupsService = new GroupsService();

    @observable
    error = null;

    @observable
    loading = false;

    sendRequest = async () => {
        if (this.error) {
            return this.props.toggle();
        }
        try {
            this.loading = true;
            await this.groupsService.sendJoinRequest();
            this.loading = false;
            this.props.toggle();
        } catch (e) {
            this.error = e;
            this.loading = false;
        }
    };

    render() {
        const {isOpen, camp, toggle, t} = this.props;
        return (
            <Modal className="JoinModal" isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{t('camps:joinModal.header')}</ModalHeader>
                <ModalBody>
                    {
                        // TODO - implement loader
                        this.loading ? <div className="loader small"></div> :
                        this.error ? t(this.error.message) : t('camps:joinModal.body', {campname: this.groupsService.getPropertyByLang(camp, 'name')})
                    }

                </ModalBody>
                <ModalFooter>
                    <Button disabled={this.loading} color="secondary" onClick={toggle}>{t('cancel')}</Button>{' '}
                    <Button disabled={this.loading} color="primary" onClick={this.sendRequest}>{t('ok')}</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export const JoinCampModal = withRouter(withI18n()(BaseJoinCampModal));