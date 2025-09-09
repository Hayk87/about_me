import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslate } from "../../utils";

interface ConfirmDialogInterface {
  isOpen: boolean;
  toggle: any;
  confirm: any;
}

const ConfirmDialog = (props: ConfirmDialogInterface) => {
  const { t } = useTranslate();

  return (
      <Modal isOpen={props.isOpen} toggle={props.toggle} style={{ marginTop: '250px' }}>
        <ModalHeader toggle={props.toggle}>{t('message')}</ModalHeader>
        <ModalBody>
          {t('are_you_sure')}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.confirm}>
            {t('yes')}
          </Button>{' '}
          <Button color="danger" onClick={props.toggle}>
            {t('no')}
          </Button>
        </ModalFooter>
      </Modal>
  );
}

export default ConfirmDialog;