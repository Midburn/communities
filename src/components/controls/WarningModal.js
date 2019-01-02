import React from 'react';
import { Modal, ModalHeader, ModalBody, MDBIcon } from 'mdbreact';
import '../groups/JoinGroupModal.scss';

export const WarningModal = ({isOpen, toggle, title, text}) => {
    return (
        <Modal className="JoinModal" isOpen={isOpen} toggle={toggle}>
            <ModalHeader color="warning" toggle={toggle}>{title} <MDBIcon icon="exclamation"/></ModalHeader>
            <ModalBody>
                {text}
            </ModalBody>
        </Modal>
    );
};
