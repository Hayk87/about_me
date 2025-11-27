import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import Loading from "../../components/Loading";
import { applicationBaseURL, useTranslate, rightsMapperData, checkPermission, adminPagesPath } from "../../utils";
import { getProductsCategoryById, createProductsCategories, updateProductsCategories } from "../../api/requests";
import { RootState } from "../../store";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";

interface CreateUpdateFormInterface {
  id?: string;
}

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<{ code: string, is_public: boolean, title: Record<string, string> }>({ code: '', is_public: false, title: {} });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useToast();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const parsed = queryString.parse(location.search);
  const updateUnavailable = !!(id && !checkPermission(profile.data, rightsMapperData.productCategoriesUpdate));

  const setValue = (lang: string) => (ev: any) => {
    const { value } = ev.target;
    setState(prev => ({ ...prev, title: { ...prev.title, [lang]: ev.target.value } }));
    if (lang === 'en') {
      setState((prev: any) => ({ ...prev, code: value.split(' ').filter((v: string) => !!v.trim()).join('-').toLowerCase() }));
      setErrors((prev: any) => ({ ...prev, code: '' }));
    }
  }

  const setCode = (ev: any) => {
    setState(prev => ({ ...prev, code: ev.target.value }));
  }

  const setCheckboxFieldsValue = (key: string) => (ev: any) => {
    setState((prev: any) => ({ ...prev, [key]: ev.target.checked }));
  }

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.productCategories}${searchStr ? `?${searchStr}` : ''}`);
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (updateUnavailable) return;
    setLoading(true);
    setErrors({});
    let promise = null;
    if (id) {
      promise = updateProductsCategories(id, state);
    } else {
      promise = createProductsCategories(state);
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
      getProductsCategoryById(id)
        .then(res => {
          setState({ title: res.data.title, is_public: res.data.is_public, code: res.data.code });
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
      <Form onSubmit={handleSave} className={styles.createUpdateForm}>
        <Row>
          {languages.list.map(lang => (
            <Col key={lang.code}>
              <FormGroup>
                <Label for={`title_${lang.code}`}>{`${t('naming')} (${lang.name})`} <span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  id={`title_${lang.code}`}
                  placeholder={`${t('naming')} (${lang.name})`}
                  onInput={setValue(lang.code)}
                  value={state.title[lang.code] || ''}
                  invalid={!!errors.title?.[lang.code]}
                  readOnly={updateUnavailable}
                />
                {errors.title?.[lang.code] && <FormFeedback>{t(errors.title?.[lang.code])}</FormFeedback>}
              </FormGroup>
            </Col>
          ))}
          <Col>
            <FormGroup>
              <Label for="code">{t('code')} <span className="text-danger">*</span></Label>
              <Input
                type="text"
                id="code"
                placeholder={t('code')}
                onInput={setCode}
                value={state.code || ''}
                invalid={!!errors.code}
                readOnly={updateUnavailable}
              />
              {errors.code && <FormFeedback>{t(errors.code)}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup style={{ marginTop: 35 }}>
              <Input
                type="checkbox"
                id="is_public"
                placeholder={t('is_public')}
                onChange={setCheckboxFieldsValue('is_public')}
                checked={state.is_public}
                invalid={!!errors.is_public}
                disabled={updateUnavailable}
              />
              &nbsp;&nbsp;
              <Label for="is_public">{t('products_is_public')}</Label>
              {errors.is_public && <FormFeedback>{t(errors.is_public)}</FormFeedback>}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
      </Form>
      {loading && <Loading />}
    </>
  );
}

export default CreateUpdateForm;
