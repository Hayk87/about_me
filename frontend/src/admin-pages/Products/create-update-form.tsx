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
  getMeasurementList,
  getProductsCategoriesList
} from "../../api/requests";
import { RootState } from "../../store";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";

interface CreateUpdateFormInterface {
  id?: string;
}

interface OptionsInterface { category_id: { value: number, title: string }[], measurement_id: { value: number, title: string }[] }

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<OptionsInterface>({ category_id: [], measurement_id: [] });
  const selectedCategory = options.category_id.find((c: any) => c.value === state.category_id);
  const selectedMeasurement = options.measurement_id.find((c: any) => c.value === state.measurement_id);
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
  const updateBuyPriceAvailable = id && checkPermission(profile.data, rightsMapperData.productUpdateOnlyBuyPrice);
  const updateSellPriceAvailable = id && checkPermission(profile.data, rightsMapperData.productUpdateOnlySellPrice);
  const enableUpdateForm = !updateUnavailable || updateBuyPriceAvailable || updateSellPriceAvailable;

  const setValue = (lang: string) => (ev: any) => {
    setState((prev: any) => ({ ...prev, title: { ...prev.title, [lang]: ev.target.value } }));
    setErrors((prev: any) => ({ ...prev, title: { ...prev.title, [lang]: '' } }));
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
    if (!enableUpdateForm) return;
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
            category_id: res.data.category?.id,
            measurement_id: res.data.measurement?.id,
            quantity: res.data.quantity,
            buy_price: res.data.buy_price,
            sell_price: res.data.sell_price,
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
    const getAll = { lang: lngCode, page: 1, all: 'on' };
    Promise.all([getMeasurementList(getAll), getProductsCategoriesList(getAll)])
      .then(res => {
        setOptions({
          measurement_id: res[0].data.list.map((item: any) => ({ label: item.measurement_title?.[lngCode], value: item.measurement_id })),
          category_id: res[1].data.list.map((item: any) => ({ label: item.product_category_title?.[lngCode], value: item.product_category_id })),
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
            {languages.list.map(lang => (
              <FormGroup key={lang.code}>
                <Label for={`title_${lang.code}`}>{`${t('naming')} (${lang.name})`}</Label>
                <Input
                  type="text"
                  id={`title_${lang.code}`}
                  placeholder={`${t('naming')} (${lang.name})`}
                  onInput={setValue(lang.code)}
                  value={state.title?.[lang.code] || ''}
                  invalid={!!errors.title?.[lang.code]}
                  disabled={updateUnavailable}
                />
                {errors.title?.[lang.code] && <FormFeedback>{t(errors.title?.[lang.code])}</FormFeedback>}
              </FormGroup>
            ))}
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
            <FormGroup>
              <Label htmlFor="measurement_id">{t('measurement_title')}</Label>
              <Select
                id="measurement_id"
                placeholder={t('measurement_title')}
                options={options.measurement_id}
                value={selectedMeasurement || null}
                onChange={handleOption('measurement_id')}
                isDisabled={updateUnavailable}
                isClearable
              />
              <Input type="hidden" invalid />
              {errors.measurement_id && <FormFeedback>{t(errors.measurement_id)}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="quantity">{t('products_quantity')}</Label>
              <Input
                type="text"
                id="quantity"
                placeholder={t('products_quantity')}
                onInput={setFloatFieldsValue('quantity')}
                value={state.quantity === undefined ? '' : formatNumberWithCommas(state.quantity)}
                invalid={!!errors.quantity}
                disabled={updateUnavailable}
              />
              {errors.quantity && <FormFeedback>{t(errors.quantity)}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="buy_price">{t('products_buy_price')}</Label>
              <Input
                type="text"
                id="buy_price"
                placeholder={t('products_buy_price')}
                onInput={setFloatFieldsValue('buy_price')}
                value={state.buy_price === undefined ? '' : formatNumberWithCommas(state.buy_price)}
                invalid={!!errors.buy_price}
                disabled={updateBuyPriceAvailable ? !updateBuyPriceAvailable : updateUnavailable}
              />
              {errors.buy_price && <FormFeedback>{t(errors.buy_price)}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="sell_price">{t('products_sell_price')}</Label>
              <Input
                type="text"
                id="sell_price"
                placeholder={t('products_sell_price')}
                onInput={setFloatFieldsValue('sell_price')}
                value={state.sell_price === undefined ? '' : formatNumberWithCommas(state.sell_price)}
                invalid={!!errors.sell_price}
                disabled={updateSellPriceAvailable ? !updateSellPriceAvailable : updateUnavailable}
              />
              {errors.sell_price && <FormFeedback>{t(errors.sell_price)}</FormFeedback>}
            </FormGroup>
            <div className={styles.buttonsActions}>
              <Button type="button" color="secondary" className={styles.goBack} onClick={goBack} size="sm">
                <FaArrowLeft /> {t('go_back')}
              </Button>
              {enableUpdateForm && (
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
