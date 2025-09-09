import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import Loading from "../../components/Loading";
import {
  applicationBaseURL,
  useTranslate,
  rightsMapperData,
  checkPermission,
  floatPositiveNumberRegexp,
  formatNumberWithCommas,
  adminPagesPath
} from "../../utils";
import {
  getProductById,
  createProduct,
  updateProduct,
  getProductsCategoriesList
} from "../../api/requests";
import { RootState } from "../../store";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";
import { ProductsCategoriesSearchInterface } from "../../interfaces";

interface CreateUpdateFormInterface {
  id?: string;
}

interface OptionsInterface { category_id: { value: number, title: string }[] }

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<OptionsInterface>({ category_id: [] });
  const selectedCategory = options.category_id.find((c: any) => c.value === state.category_id);
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useToast();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const updateUnavailable = !!(id && !checkPermission(profile.data, rightsMapperData.productUpdate));

  const setValue = (lang: string, key: 'title' | 'content') => (ev: any) => {
    setState((prev: any) => ({ ...prev, [key]: { ...prev[key], [lang]: ev.target.value } }));
    setErrors((prev: any) => ({ ...prev, [key]: { ...prev[key], [lang]: '' } }));
  }

  const handleChange = (key: 'link' | 'code') => (ev: any) => {
    setState((prev: any) => ({ ...prev, [key]: ev.target.value }));
    setErrors((prev: any) => ({ ...prev, [key]: '' }));
  }

  const setFloatFieldsValue = (key: string) => (ev: any) => {
    let { value } = ev.target;
    value = value.replace(/,/g, '');
    if (value && !floatPositiveNumberRegexp.test(value)) {
      return;
    }
    setState((prev: any) => ({ ...prev, [key]: value ? parseFloat(value) : '' }));
    setErrors((prev: any) => ({ ...prev, [key]: '' }));
  }

  const handleOption = (key: string) => (option: any) => {
    setState((prev: any) => ({ ...prev, [key]: option?.value }));
    setErrors((prev: any) => ({ ...prev, [key]: '' }));
  }

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.products}${searchStr ? `?${searchStr}` : ''}`);
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (updateUnavailable) return;
    setLoading(true);
    setErrors({});
    let promise = null;
    if (id) {
      promise = updateProduct(id, state);
    } else {
      promise = createProduct(state);
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
      getProductById(id)
        .then(res => {
          setState({
            title: res.data.title,
            content: res.data.content,
            category_id: res.data.category?.id,
            code: res.data.code,
            link: res.data.link,
            price: res.data.price,
          });
        })
        .catch(err => {
          console.log(err.response.data.message);
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    const getAll: ProductsCategoriesSearchInterface = { lang: lngCode, all: 'on', page: 1 } as ProductsCategoriesSearchInterface;
    Promise.all([getProductsCategoriesList(getAll)])
      .then(res => {
        setOptions({
          category_id: res[0].data.list.map((item: any) => ({ label: item.product_category_title?.[lngCode], value: item.product_category_id })),
        });
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [lngCode]);

  return (
    <>
      <Row>
        <Col md={4} />
        <Col md={4}>
          <Form onSubmit={handleSave} className={styles.createUpdateForm}>
            <FormGroup>
              <Label htmlFor="category_id">{t('category_title')}</Label>
              <Select
                id="category_id"
                placeholder={t('category_title')}
                options={options.category_id}
                value={selectedCategory || null}
                onChange={handleOption('category_id')}
                isDisabled={updateUnavailable}
                isClearable
              />
              <Input type="hidden" invalid />
              {errors.category_id && <FormFeedback>{t(errors.category_id)}</FormFeedback>}
            </FormGroup>
            {languages.list.map(lang => (
              <React.Fragment key={lang.code}>
                <FormGroup>
                  <Label for={`title_${lang.code}`}>{`${t('naming')} (${lang.name})`}</Label>
                  <Input
                    type="text"
                    id={`title_${lang.code}`}
                    placeholder={`${t('naming')} (${lang.name})`}
                    onInput={setValue(lang.code, 'title')}
                    value={state.title?.[lang.code] || ''}
                    invalid={!!errors.title?.[lang.code]}
                    disabled={updateUnavailable}
                  />
                  {errors.title?.[lang.code] && <FormFeedback>{t(errors.title?.[lang.code])}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                  <Label for={`content_${lang.code}`}>{`${t('content')} (${lang.name})`}</Label>
                  <Input
                    type="textarea"
                    id={`content_${lang.code}`}
                    placeholder={`${t('content')} (${lang.name})`}
                    onInput={setValue(lang.code, 'content')}
                    value={state.content?.[lang.code] || ''}
                    invalid={!!errors.content?.[lang.code]}
                    disabled={updateUnavailable}
                  />
                  {errors.content?.[lang.code] && <FormFeedback>{t(errors.content?.[lang.code])}</FormFeedback>}
                </FormGroup>
              </React.Fragment>
            ))}
            <FormGroup>
              <Label for="code">{t('products_code')}</Label>
              <Input
                type="text"
                id="code"
                placeholder={t('products_code')}
                onInput={handleChange('code')}
                value={state.code || ''}
                invalid={!!errors.code}
                disabled={updateUnavailable}
              />
              {errors.code && <FormFeedback>{t(errors.code)}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="link">{t('products_link')}</Label>
              <Input
                type="text"
                id="link"
                placeholder={t('products_link')}
                onInput={handleChange('link')}
                value={state.link || ''}
                invalid={!!errors.link}
                disabled={updateUnavailable}
              />
              {errors.link && <FormFeedback>{t(errors.link)}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="price">{t('products_price')}</Label>
              <Input
                type="text"
                id="price"
                placeholder={t('products_price')}
                onInput={setFloatFieldsValue('price')}
                value={state.price === undefined ? '' : formatNumberWithCommas(state.price)}
                invalid={!!errors.price}
                disabled={updateUnavailable}
              />
              {errors.price && <FormFeedback>{t(errors.price)}</FormFeedback>}
            </FormGroup>
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
