import React, { useEffect, useId } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, FormFeedback } from "reactstrap";
import { useTranslate, authenticatorTokenRegexp } from "../../utils";

interface Google2FADialogInterface {
  isOpen: boolean;
  toggle: any;
  confirm: any;
  handle: any;
  error?: string;
  token?: string;
}

const Google2FADialog = (props: Google2FADialogInterface) => {
  const idToken = useId();
  const { t } = useTranslate();
  const isValidToken = !!(props.token && authenticatorTokenRegexp.test(props.token));

  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => document.getElementById(idToken)?.focus(), 500);
    }
  }, [props.isOpen]);

  return (
      <Modal isOpen={props.isOpen} toggle={props.toggle} style={{ marginTop: '250px' }}>
        <ModalHeader toggle={props.toggle}>{t('2FA_code')}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input type="text" invalid={!!props.error} onChange={props.handle} value={props.token} id={idToken} />
            {props.error && <FormFeedback>{t(props.error)}</FormFeedback>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={isValidToken ? props.confirm : () => {}} disabled={!isValidToken}>
            {t('confirm')}
          </Button>{' '}
          <Button color="secondary" onClick={props.toggle}>
            {t('close')}
          </Button>
        </ModalFooter>
      </Modal>
  );
}

export default Google2FADialog;