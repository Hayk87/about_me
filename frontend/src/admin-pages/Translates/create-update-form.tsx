import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import Loading from "../../components/Loading";
import { applicationBaseURL, useTranslate, rightsMapperData, checkPermission, adminPagesPath } from "../../utils";
import { getTranslationById, createTranslate, updateTranslate, getCurrentTranslates } from "../../api/requests";
import { RootState } from "../../store";
import { initCurrentTranslates } from "../../store/slices/translates";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";

interface CreateUpdateFormInterface {
  id?: string;
}

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<{ key: string, value: any }>({ key: '', value: {} });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useToast();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const updateUnavailable = !!(id && !checkPermission(profile.data, rightsMapperData.translateUpdate));

  const setKey = (ev: any) => {
    setState(prev => ({ ...prev, key: ev.target.value }));
  }

  const setValue = (lang: string) => (ev: any) => {
    setState(prev => ({ ...prev, value: { ...prev.value, [lang]: ev.target.value } }));
  }

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.translates}${searchStr ? `?${searchStr}` : ''}`);
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (updateUnavailable) return;
    setLoading(true);
    setErrors({});
    let promise = null;
    if (id) {
      promise = updateTranslate(id, state);
    } else {
      promise = createTranslate(state);
    }
    promise
      .then(() => {
        alertSuccess(t('successfully_saved'));
        getCurrentTranslates(lngCode)
          .then(trs => {
            dispatch(initCurrentTranslates(trs.data));
          })
          .catch(err => console.log('changeLanguage: ', err));
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
      getTranslationById(id)
        .then(res => {
          setState({ key: res.data.key, value: res.data.value });
        })
        .catch(err => {
          console.log(err.response.data.message);
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
          <Form onSubmit={handleSave} className={styles.createUpdateForm}>
            <FormGroup>
              <Label for="key">{t('tr_key')}</Label>
              <Input
                type="text"
                id="key"
                placeholder={t('tr_key')}
                onInput={id ? () => {} : setKey}
                value={state.key || ''}
                invalid={!!errors.key}
                disabled={!!id}
              />
              {errors.key && <FormFeedback>{t(errors.key)}</FormFeedback>}
            </FormGroup>
            {languages.list.map(lang => (
              <FormGroup key={lang.code}>
                <Label for={`value_${lang.code}`}>{`${t('tr_value')} (${lang.name})`}</Label>
                <Input
                  type="text"
                  id={`value_${lang.code}`}
                  placeholder={`${t('tr_value')} (${lang.name})`}
                  onInput={setValue(lang.code)}
                  value={state.value[lang.code] || ''}
                  invalid={!!errors.value?.[lang.code]}
                  readOnly={updateUnavailable}
                />
                {errors.value?.[lang.code] && <FormFeedback>{t(errors.value?.[lang.code])}</FormFeedback>}
              </FormGroup>
            ))}
            <div className={styles.buttonsActions}>
              <Button type="button" color="secondary" className={styles.goBack} onClick={goBack} size="sm">
                <FaArrowLeft /> {t('go_back')}
              </Button>
              {!updateUnavailable && (
                <Button type="submit" color="primary" className={styles.saveButton} size="sm">
                  <FaFloppyDisk /> {t('save')}
                </Button>
              )}
            </div>
          </Form>
        </Col>
      </Row>
      {loading && <Loading />}
    </>
  );
}

export default CreateUpdateForm;
