import React, { ChangeEvent, useCallback, useState } from "react";
import { Alert, Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { sendOfferToAdmin } from "../../api/requests";
import { useTranslate } from "../../utils";

interface IForm {
  name: string;
  email: string;
  content: string;
  files: any[]
}

const initialFormData: IForm = {
  name: '',
  email: '',
  content: '',
  files: []
}

const OfferForm = () => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formSent, setFormSent] = useState<boolean>(false);
  const [formData, setFormData] = useState<IForm>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslate();

  const handleChange = useCallback((key: keyof IForm) => (ev: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [key]: ev.target.value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  const handleFilesChange = (ev: any) => {
    const { files } = ev.target;
    const filesData: any = [];
    for (const file of files) {
      filesData.push(file);
    }
    setFormData(prev => ({ ...prev, files: filesData }));
  }

  const handleSubmit = (ev: any) => {
    ev.preventDefault();
    if (formSubmitted) return;
    setFormSubmitted(true);
    setErrors({});
    const send = new FormData();
    send.append('name', formData.name);
    send.append('email', formData.email);
    send.append('content', formData.content);
    for (const file of formData.files) {
      send.append('files', file);
    }
    sendOfferToAdmin(send)
      .then(() => {
        setFormSent(true);
      })
      .catch(err => {
        setErrors(err.response?.data?.message);
      })
      .finally(() => {
        setFormSubmitted(false);
      });
  }

  return (
    <Container className={'mt-4'}>
      {formSent ? (
        <Row>
          <Col>
            <Alert color="primary" className="text-center">
              {t('offer_success_sent')} &#128515;
            </Alert>
          </Col>
        </Row>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs="12" sm="6">
              <FormGroup>
                <Label for="name">{t('your_name')}: <span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder={t('your_name')}
                  value={formData.name}
                  onChange={handleChange('name')}
                  invalid={!!errors.name}
                />
                {errors.name && <FormFeedback>{t(errors.name)}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs="12" sm="6">
              <FormGroup>
                <Label for="email">{t('email')}: <span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={handleChange('email')}
                  invalid={!!errors.email}
                />
                {errors.email && <FormFeedback>{t(errors.email)}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="files">{t('files')}: <small>({t('file_types')})</small></Label>
                <Input
                  type="file"
                  name="files"
                  id="files"
                  onChange={handleFilesChange}
                  multiple={true}
                  accept={"image/jpeg,image/png,application/pdf,application/vnd.ms-excel"}
                  invalid={!!errors.files}
                />
                {errors.files && <FormFeedback>{t(errors.files)}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="content">{t('information')}: <span className="text-danger">*</span></Label>
                <Input
                  type="textarea"
                  name="content"
                  id="content"
                  placeholder={t('information_placeholder')}
                  value={formData.content}
                  onChange={handleChange('content')}
                  style={{ height: 150 }}
                  invalid={!!errors.content}
                />
                {errors.content && <FormFeedback>{t(errors.content)}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" color="primary" block>
            {t('submit')}
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default OfferForm;
