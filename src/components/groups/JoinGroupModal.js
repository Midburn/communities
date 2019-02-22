import React from 'react';
import { withI18n } from 'react-i18next';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'mdbreact';
import { withRouter } from 'react-router-dom';
import { GroupsService } from '../../services/groups';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './JoinGroupModal.scss';

@observer
class BaseJoinGroupModal extends React.Component {

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
        const {isOpen, group, toggle, t, match, lng} = this.props;
        return (
            <Modal className="JoinModal" isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{t(`${match.params.groupType}:joinModal.header`)}</ModalHeader>
                <ModalBody>
                    {
                        // TODO - implement loader
                        this.loading ? <div className="loader small"></div> :
                        this.error ? t(this.error.message) : t(`${match.params.groupType}:joinModal.body`, {name: this.groupsService.getPropertyByLang(group, 'name', lng)})
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

export const JoinGroupModal = withRouter(withI18n()(BaseJoinGroupModal));