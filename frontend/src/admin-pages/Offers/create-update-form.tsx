import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col, Badge } from 'reactstrap';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Loading from "../../components/Loading";
import { applicationBaseURL, useTranslate, adminPagesPath } from "../../utils";
import { getOfferById, getOfferFileById } from "../../api/requests";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";

interface CreateUpdateFormInterface {
  id?: string;
}

interface StateInterface {
  id?: number | string;
  name: string;
  email: string;
  content: string;
  files: {
    id: string;
    directory: string;
    name: string;
    size: number;
    type: string;
  }[]
}

const initialState: StateInterface = {
  name: '',
  email: '',
  content: '',
  files: []
}

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<StateInterface>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertError } = useToast();
  const parsed = queryString.parse(location.search);

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.offers}${searchStr ? `?${searchStr}` : ''}`);
  }

  const showFile = (fileId: string) => () => {
    getOfferFileById(fileId)
      .then(res => {
        const url = window.URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch(async err => {
        const text = await err.response.data.text();
        const errorObject = JSON.parse(text);
        if (typeof errorObject.message === 'string') {
          alertError(`${errorObject.statusCode}: ${t(errorObject.message)}`);
        }
      });
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      getOfferById(id)
        .then(res => {
          setState({ ...res.data });
        })
        .catch(err => {
          if (typeof err.response.data.message === 'string') {
            alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <>
      <Row>
        <Col md={4} />
        <Col md={4}>
          <Form onSubmit={(ev) => ev.preventDefault()} className={styles.createUpdateForm}>
            <FormGroup>
              <Label for="name">{t('naming')}</Label>
              <Input
                type="text"
                id="name"
                value={state.name}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">{t('email')}</Label>
              <Input
                type="text"
                id="email"
                value={state.email}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">{t('content')}</Label>
              <Input
                type="textarea"
                id="content"
                value={state.content}
                style={{ height: '250px' }}
                readOnly
              />
            </FormGroup>
            {state.files?.length > 0 && (
              <div className={styles.filesContainer}>
                {state.files?.map(file => (
                  <a href={`${process.env.REACT_APP_UPLOADED_FILES_BASE_URL || ''}/api/files/details/${file.id}`} target="_blank" key={file.id}>
                    <Badge
                      color="success"
                      // onClick={showFile(file.id)}
                    >
                      {file.name}
                    </Badge>
                  </a>
                ))}
              </div>
            )}
            <div className={styles.buttonsActions}>
              <Button type="button" color="secondary" className={styles.goBack} onClick={goBack} size="sm">
                <FaArrowLeft /> {t('go_back')}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      {loading && <Loading />}
    </>
  );
}

export default CreateUpdateForm;
