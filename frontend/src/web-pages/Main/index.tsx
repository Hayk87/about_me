import React, { useState, useCallback, ChangeEvent, useMemo } from "react";
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, FormFeedback, Alert } from 'reactstrap';
import { sendOfferToAdmin } from "../../api/requests";
import { useLanguage, useTranslate, webPagesPath } from "../../utils";
import WebLayout from "../../Layouts/WebLayout";
import styles from "./styles.module.scss";

export const path: string = webPagesPath.mainPage;

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

const pageContent: Record<string, React.ReactElement> = {
  hy: (
    <>
      <h1 className={styles.h1}>
        Build your website or internal software system here with the latest technologies &#128187;
      </h1>
      <h2>Ողջույն &#128075;</h2>
      <div className="" style={{ fontSize: 18 }}>
        <div>
          If you're looking to have an internal software system or websites built using modern technologies such
          as <b><a href="https://nestjs.com/" target="_blank">NestJS</a></b>, <b><a href="https://react.dev/"
                                                                                    target="_blank">ReactJS</a></b>,
          and <b><a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a></b>, feel free to reach out—I can deliver it in a short timeframe. I build systems
          entirely from scratch, including:
        </div>
        <ul>
          <li>Database architecture</li>
          <li>Backend development with full DB integration</li>
          <li>Web design</li>
          <li>Mobile responsiveness (optional, based on your needs)</li>
        </ul>
        <div>What kind of system will you get, and why use these technologies? &#129335;</div>
        <ul>
          <li>
            NestJS is a framework for NodeJS written in TypeScript. It allows developers to write clean, modular, and
            readable code. It also enhances system security.
          </li>
          <li>
            ReactJS is one of the most advanced and widely used frontend JavaScript libraries worldwide. It enables
            the development of Single Page Applications (SPAs), where content is built with JavaScript, offering
            faster performance compared to SSR (Server-Side Rendering) systems.
          </li>
          <li>
            The system/website will include:
            <ol>
              <li>A REST API backend built with NestJS</li>
              <li>A PostgreSQL database</li>
              <li>A frontend developed in ReactJS with TypeScript</li>
            </ol>
          </li>
          <li>
            The system/website will support <b>multiple languages</b>, and you will be able to define the desired
            languages before development begins.
          </li>
          <li>
            The system/website will include two main pages:
            <ol>
              <li>Login Page – where users can access the system/website</li>
              <li>Dashboard Page – where authenticated users will perform their tasks</li>
            </ol>
          </li>
          <li>
            If desired, the system can be restricted to specific IP addresses, manageable by the main administrator
            from within the system.
          </li>
          <li>
            There will be a <b>user roles</b> and <b>permissions</b> management module, allowing the main
            administrator to define what each user can see and do within the system.
          </li>
          <li>
            The main administrator will have full control over user management, including:
            <ol>
              <li>Adding and removing users</li>
              <li>Blocking/unblocking users (with changes taking immediate effect even if the user is logged in)</li>
              <li>Assigning usernames and passwords</li>
              <li>Allowing users to change their password upon first login</li>
              <li>Enabling Google 2FA for added security</li>
              <li>Resetting a user’s password if forgotten</li>
            </ol>
          </li>
          <li>
            Soft deletion: When something is deleted, it will not be permanently removed but will become inactive and
            hidden from the system interface.
          </li>
        </ul>
        <div>
          I can build internal systems of any complexity with multilingual support and role-based access control. I
          guarantee clean code and high quality. Prices vary depending on the project scope, starting at <b>2,000
          USD</b>.
        </div>

        <div>Project Workflow (Step-by-Step):</div>

        <ol>
          <li>
            You send me the system's content:
            <ul>
              <li>Required modules/sections</li>
              <li>Detailed descriptions for each section</li>
              <li>Functional requirements</li>
            </ul>
          </li>
          <li>You send me the web design for each page.</li>
          <li>
            I evaluate the scope and provide:
            <ul>
              <li>A price quote</li>
              <li>A timeframe</li>
            </ul>
          </li>
          <li>
            If we reach an agreement, I will start by building the Login page with login/logout functionality. Once
            you review and approve this initial step, you'll transfer <b>10%</b> of the total project cost to a bank
            account I will provide, and then full development will begin.
          </li>
          <li>
            Upon completing the project, I will give you access to a test version of your system where you can log in
            and try everything out.
            <br />
            If you approve the final result, you’ll be required to transfer the remaining <b>90%</b>, after which
            I’ll deliver the full source code and help you with hosting if needed.
          </li>
          <li>
            After the system is live, I offer 1 month of free support (bug fixes and small design adjustments)
          </li>
        </ol>
        <div>
          If you have some offer, please fill the form below:
        </div>
      </div>
    </>
  ),
  en: (
    <>
      <h1 className={styles.h1}>
        Build your website or internal software system here with the latest technologies &#128187;
      </h1>
      <h2>Hello &#128075;</h2>
      <div className="" style={{ fontSize: 18 }}>
        <div>
          If you're looking to have an internal software system or websites built using modern technologies such
          as <b><a href="https://nestjs.com/" target="_blank">NestJS</a></b>, <b><a href="https://react.dev/"
                                                                                    target="_blank">ReactJS</a></b>,
          and <b><a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a></b>, feel free to reach out—I can deliver it in a short timeframe. I build systems
          entirely from scratch, including:
        </div>
        <ul>
          <li>Database architecture</li>
          <li>Backend development with full DB integration</li>
          <li>Web design</li>
          <li>Mobile responsiveness (optional, based on your needs)</li>
        </ul>
        <div>What kind of system will you get, and why use these technologies? &#129335;</div>
        <ul>
          <li>
            NestJS is a framework for NodeJS written in TypeScript. It allows developers to write clean, modular, and
            readable code. It also enhances system security.
          </li>
          <li>
            ReactJS is one of the most advanced and widely used frontend JavaScript libraries worldwide. It enables
            the development of Single Page Applications (SPAs), where content is built with JavaScript, offering
            faster performance compared to SSR (Server-Side Rendering) systems.
          </li>
          <li>
            The system/website will include:
            <ol>
              <li>A REST API backend built with NestJS</li>
              <li>A PostgreSQL database</li>
              <li>A frontend developed in ReactJS with TypeScript</li>
            </ol>
          </li>
          <li>
            The system/website will support <b>multiple languages</b>, and you will be able to define the desired
            languages before development begins.
          </li>
          <li>
            The system/website will include two main pages:
            <ol>
              <li>Login Page – where users can access the system/website</li>
              <li>Dashboard Page – where authenticated users will perform their tasks</li>
            </ol>
          </li>
          <li>
            If desired, the system can be restricted to specific IP addresses, manageable by the main administrator
            from within the system.
          </li>
          <li>
            There will be a <b>user roles</b> and <b>permissions</b> management module, allowing the main
            administrator to define what each user can see and do within the system.
          </li>
          <li>
            The main administrator will have full control over user management, including:
            <ol>
              <li>Adding and removing users</li>
              <li>Blocking/unblocking users (with changes taking immediate effect even if the user is logged in)</li>
              <li>Assigning usernames and passwords</li>
              <li>Allowing users to change their password upon first login</li>
              <li>Enabling Google 2FA for added security</li>
              <li>Resetting a user’s password if forgotten</li>
            </ol>
          </li>
          <li>
            Soft deletion: When something is deleted, it will not be permanently removed but will become inactive and
            hidden from the system interface.
          </li>
        </ul>
        <div>
          I can build internal systems of any complexity with multilingual support and role-based access control. I
          guarantee clean code and high quality. Prices vary depending on the project scope, starting at <b>2,000
          USD</b>.
        </div>

        <div>Project Workflow (Step-by-Step):</div>

        <ol>
          <li>
            You send me the system's content:
            <ul>
              <li>Required modules/sections</li>
              <li>Detailed descriptions for each section</li>
              <li>Functional requirements</li>
            </ul>
          </li>
          <li>You send me the web design for each page.</li>
          <li>
            I evaluate the scope and provide:
            <ul>
              <li>A price quote</li>
              <li>A timeframe</li>
            </ul>
          </li>
          <li>
            If we reach an agreement, I will start by building the Login page with login/logout functionality. Once
            you review and approve this initial step, you'll transfer <b>10%</b> of the total project cost to a bank
            account I will provide, and then full development will begin.
          </li>
          <li>
            Upon completing the project, I will give you access to a test version of your system where you can log in
            and try everything out.
            <br />
            If you approve the final result, you’ll be required to transfer the remaining <b>90%</b>, after which
            I’ll deliver the full source code and help you with hosting if needed.
          </li>
          <li>
            After the system is live, I offer 1 month of free support (bug fixes and small design adjustments)
          </li>
        </ol>
        <div>
          If you have some offer, please fill the form below:
        </div>
      </div>
    </>
  )
}

const MainPage = () => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formSent, setFormSent] = useState<boolean>(false);
  const [formData, setFormData] = useState<IForm>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslate();
  const { lngCode } = useLanguage();
  const formIsCompleted = useMemo(() => !!formData.name && !!formData.email && !!formData.content, [formData.name, formData.email, formData.content]);

  const handleChange = useCallback((key: keyof IForm) =>
                                            (ev: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [key]: ev.target.value })), []);

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
    if (formSubmitted || !formIsCompleted) return;
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
    <WebLayout>
      <>
        {pageContent[lngCode]}
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
                <Col>
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
                <Col>
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
              <Button type="submit" color="primary" disabled={!formIsCompleted} block>
                {t('submit')}
              </Button>
            </Form>
          )}
        </Container>
      </>
    </WebLayout>
  );
}

export default MainPage;