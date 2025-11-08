import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import Loading from "../../components/Loading";
import { applicationBaseURL, useTranslate, rightsMapperData, checkPermission, adminPagesPath } from "../../utils";
import { getSystemUserById, createSystemUser, updateSystemUser, getStaffsList } from "../../api/requests";
import { RootState } from "../../store";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";
import Select from "react-select";

interface CreateUpdateFormInterface {
  id?: string;
}

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<{ staff_id: any[] }>({ staff_id: [] });
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useToast();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  let selectedCategory = options.staff_id.find((c: any) => c.staff_id === state.staff_id);
  selectedCategory = selectedCategory ? { value: selectedCategory.staff_id, label: selectedCategory.staff_title?.[lngCode] } : null;
  const updateUnavailable = !!(id && !checkPermission(profile.data, rightsMapperData.systemUserUpdate));

  const setFieldValue = (key: string) => (ev: any) => {
    setState((prev: any) => ({ ...prev, [key]: ev.target.value }));
  }

  const handleOption = (key: string) => (option: any) => {
    setState((prev: any) => ({ ...prev, [key]: option?.value }));
  }

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.systemUsers}${searchStr ? `?${searchStr}` : ''}`);
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (updateUnavailable) return;
    setLoading(true);
    setErrors({});
    let promise = null;
    if (id) {
      promise = updateSystemUser(id, state);
    } else {
      promise = createSystemUser(state);
    }
    promise
      .then(() => {
        alertSuccess(t('successfully_saved'));
      })
      .catch(err => {
        if (typeof err.response.data.message === 'object') {
          setErrors(err.response.data.message);
        } else {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      getSystemUserById(id)
        .then(res => {
          setState({ ...res.data, staff_id: res.data.staff?.id });
        })
        .catch(err => {
          console.log('getSystemUserById error:', err.response.data.message);
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        })
        .finally(() => setLoading(false));
    }
    const getAll = { lang: lngCode, page: 1, all: 'on' };
    getStaffsList(getAll)
      .then(res => {
        setOptions({ staff_id: res.data.list });
      })
      .catch(err => {
        console.log("getStaffsList.err => ", err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      });
  }, []);

  return (
    <>
      <Form onSubmit={handleSave} className={styles.createUpdateForm}>
        <Row>
          <Col>
            <FormGroup>
              <Label for="first_name">{t('first_name')}</Label>
              <Input
                type="text"
                id="first_name"
                placeholder={t('first_name')}
                onInput={setFieldValue('first_name')}
                value={state.first_name || ''}
                invalid={!!errors.first_name}
                readOnly={updateUnavailable}
              />
              {errors.first_name && <FormFeedback>{t(errors.first_name)}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="last_name">{t('last_name')}</Label>
              <Input
                type="text"
                id="last_name"
                placeholder={t('last_name')}
                onInput={setFieldValue('last_name')}
                value={state.last_name || ''}
                invalid={!!errors.last_name}
                readOnly={updateUnavailable}
              />
              {errors.last_name && <FormFeedback>{t(errors.last_name)}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="email">{t('email')}</Label>
              <Input
                type="text"
                id="email"
                placeholder={t('email')}
                onInput={!!id ? () => {} : setFieldValue('email')}
                value={state.email || ''}
                invalid={!!errors.email}
                readOnly={updateUnavailable}
                disabled={!!id}
              />
              {errors.email && <FormFeedback>{t(errors.email)}</FormFeedback>}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="password">{t('password')}</Label>
              <Input
                type="text"
                id="password"
                placeholder={t('password')}
                onInput={setFieldValue('password')}
                value={state.password || ''}
                invalid={!!errors.password}
                readOnly={updateUnavailable}
              />
              {errors.password && <FormFeedback>{t(errors.password)}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label htmlFor="staff_id">{t('staff_title')}</Label>
              <Select
                id="staff_id"
                placeholder={t('staff_title')}
                options={options.staff_id.map((o: any) => ({ value: o.staff_id, label: o.staff_title?.[lngCode] }))}
                value={selectedCategory || null}
                onChange={handleOption('staff_id')}
                isDisabled={updateUnavailable}
                isClearable
              />
              <Input type="hidden" invalid />
              {errors.staff_id && <FormFeedback>{t(errors.staff_id)}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col className={styles.buttonsActions}>
            <Button type="button" color="secondary" className={styles.goBack} onClick={goBack} size="sm">
              <FaArrowLeft /> {t('go_back')}
            </Button>
            {!updateUnavailable && (
              <Button type="submit" color="primary" className={styles.saveButton} size="sm">
                <FaFloppyDisk /> {t('save')}
              </Button>
            )}
          </Col>
        </Row>
      </Form>
      {loading && <Loading />}
    </>
  );
}

export default CreateUpdateForm;
