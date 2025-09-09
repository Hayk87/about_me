import React, { useState, useEffect, useMemo } from "react";
import { Button, Form, FormGroup, Input, FormFeedback, Row, Col, Table } from 'reactstrap';
import queryString from "query-string";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaFloppyDisk, FaPlus, FaTrash } from "react-icons/fa6";
import Loading from "../../components/Loading";
import ConfirmDialog from "../../components/Confirm-dialog";
import { applicationBaseURL, useTranslate, rightsMapperData, checkPermission, formatNumberWithCommas, adminPagesPath, floatPositiveNumberRegexp } from "../../utils";
import { getTransactionImportById, createTransactionImport, getProductsCategoriesList, getProductsList, deleteTransactionImportDetails } from "../../api/requests";
import { RootState } from "../../store";
import { useToast } from "../../hooks";
import { ProductsCategoriesSearchInterface } from "../../interfaces";
import styles from "./create-update-form-styles.module.scss";

interface CreateUpdateFormInterface {
  id?: string;
}

interface RowInterface {
  category_id?: number;
  product_id?: number;
  productsList: any[];
  count?: string;
}

interface StateInterface {
  details: RowInterface[]
}

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<StateInterface>({ details: [{ productsList: [] }] });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<{ category_id: any[] }>({ category_id: [] });
  const [deleteDetail, setDeleteDetail] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useToast();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const categoryOptions = options.category_id.map((item: any) => ({ value: item.product_category_id, label: item.product_category_title?.[lngCode] }));
  const existsRow = useMemo(() => !!id, [id]);

  const addRow = () => {
    const row = { productsList: [] };
    setState(prev => ({ ...prev, details: [...prev.details, row] }));
  }

  const handleCategory = (index: number) => async (option: any) => {
    try {
      let productsList: any = [];
      if (option?.value) {
        const _search: any = { lang: lngCode, page: 1, all: 'on', category_id: option?.value };
        const res = await getProductsList(_search);
        productsList = res.data.list;
      }
      setState(prev => {
        prev.details[index].category_id = option?.value;
        prev.details[index].product_id = undefined;
        prev.details[index].productsList = productsList;
        return { ...prev };
      });
    } catch (err: any) {
      if (typeof err.response.data.message === 'object') {
        setErrors(err.response.data.message);
      } else {
        alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
      }
    }
  }

  const handleProduct = (index: number) => (option: any) => {
    setState(prev => {
      prev.details[index].product_id = option?.value;
      return { ...prev };
    });
    if (option?.value) {
      setErrors((prev: any) => {
        if (prev.details) {
          prev.details[index].product_id = undefined;
        }
        return { ...prev };
      });
    }
  }

  const setQuantityValue = (index: number) => (ev: any) => {
    const value = ev.target.value.replace(/,/g, '');
    if (value && !floatPositiveNumberRegexp.test(value)) return;
    setState(prev => {
      prev.details[index].count = value;
      return { ...prev };
    });
    setErrors((prev: any) => {
      if (prev.details) {
        prev.details[index].count = undefined;
      }
      return { ...prev };
    });
    window.setTimeout(() => document.getElementById(`count_${index}`)?.focus(), 1);
  }

  const deleteNewRow = (index: number) => () => {
    setState(prev => {
      prev.details = prev.details.filter((_, i) => i !== index);
      return { ...prev };
    });
  }

  const deleteExistsRow = (data: any) => () => {
    setDeleteDetail({ isOpen: true, data });
  }

  const toggleExistsRow = () => {
    setDeleteDetail({ isOpen: false, data: null });
  }

  const confirmDeleteExistsRow = () => {
    deleteTransactionImportDetails(deleteDetail.data.trId, deleteDetail.data.detail_id)
      .then(() => {
        if (state.details.length === 1) {
          goBack();
        } else if (id) {
          fetchExistsTransaction(id);
        }
      })
      .catch(err => {
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      })
      .finally(() => {
        toggleExistsRow();
      });
  }


  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.transactionImports}${searchStr ? `?${searchStr}` : ''}`);
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (existsRow) return;
    setLoading(true);
    setErrors({});
    const send = { details: state.details.map(({ product_id, count }) => ({ product_id, count: parseFloat(count as string) || undefined })) };
    createTransactionImport(send)
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

  const fetchExistsTransaction = (ID: string) => {
    setLoading(true);
    getTransactionImportById(ID)
      .then(res => {
        const details = res.data?.details?.map((item: any) => ({
          trId: res.data?.id,
          detail_id: item.id,
          count: item.count,
          product_id: item.product?.id,
          category_id: item.product_category.id,
          productsList: [
            {
              id: item.product?.id,
              title: item.product?.title,
              measurement: { ...item.measurement },
              buy_price: item.price,
              quantity: item.product?.quantity
            }
          ]
        })) || [];
        setState({ details });
      })
      .catch(err => {
        console.log('getSystemUserById error:', err.response.data.message);
        alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (id) {
      fetchExistsTransaction(id);
    }
    const getAll = { lang: lngCode, page: 1, all: 'on' } as ProductsCategoriesSearchInterface;
    getProductsCategoriesList(getAll)
      .then(res => {
        setOptions({ category_id: res.data.list });
      })
      .catch(err => {
        console.log("getProductsCategoriesList.err => ", err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      });
  }, []);

  let total_rows = 0;

  return (
    <>
      <Row>
        <Col md={1} />
        <Col md={10}>
          <h1>{t('transaction_imports')}</h1>
          <Form onSubmit={handleSave} className={styles.createUpdateForm}>
            {!existsRow && (
              <div>
                <Button type="button" color="success" className={styles.addTransactionDetails} onClick={addRow} size="sm">
                  <FaPlus /> {t('add')}
                </Button>
              </div>
            )}
            <Table bordered>
              <thead>
                <tr>
                  <th className="text-center">{t('category_title')}</th>
                  <th className="text-center">{t('naming')}</th>
                  <th className={'text-center ' + styles.w_150}>{t('measurement_title')}</th>
                  <th className={'text-center ' + styles.w_150}>{t('exists_products_quantity')}</th>
                  <th className={'text-center ' + styles.w_150}>{t('products_quantity')}</th>
                  <th className={'text-center ' + styles.w_200}>{t('products_buy_price')}</th>
                  <th className={'text-center ' + styles.w_200}>{t('total_price')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {state.details.map((item, i) => {
                  const k = `${i}-${Date.now()}`;
                  const selectedCategory = categoryOptions.find(cat => cat.value === item.category_id);
                  const productOptions = item.productsList.map((p: any) => ({ value: p.id, label: p.title?.[lngCode] }));
                  const selectedProduct = item.productsList.find(p => p.id === item.product_id);
                  const row_total_price = selectedProduct?.buy_price * (parseFloat(item.count as string) || 0);
                  total_rows += row_total_price || 0;
                  return (
                    <tr key={k}>
                      <td>
                        <FormGroup>
                          <Select
                            placeholder={t('category_title')}
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={handleCategory(i)}
                            isDisabled={existsRow}
                            isClearable
                          />
                          <Input type="hidden" invalid />
                          {!selectedCategory && errors.details?.filter?.((e: any) => !!e)?.length && <FormFeedback>{t('required_field')}</FormFeedback>}
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup>
                          <Select
                            placeholder={t('naming')}
                            options={productOptions}
                            value={productOptions.find(cat => cat.value === item.product_id)}
                            onChange={handleProduct(i)}
                            isDisabled={existsRow}
                            isClearable
                          />
                          <Input type="hidden" invalid />
                          {errors.details?.[i]?.product_id && <FormFeedback>{t(errors.details?.[i]?.product_id)}</FormFeedback>}
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup>
                          <Input
                            type="text"
                            value={selectedProduct?.measurement?.title?.[lngCode]}
                            disabled
                          />
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup>
                          <Input
                            type="text"
                            value={formatNumberWithCommas(selectedProduct?.quantity)}
                            disabled
                          />
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup>
                          <Input
                            id={`count_${i}`}
                            type="text"
                            placeholder={t('products_quantity')}
                            onInput={setQuantityValue(i)}
                            value={formatNumberWithCommas(item.count)}
                            invalid={!!errors.details?.[i]?.count}
                            disabled={existsRow}
                          />
                          {errors.details?.[i]?.count && <FormFeedback>{t(errors.details?.[i]?.count)}</FormFeedback>}
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup>
                          <Input
                            type="text"
                            value={formatNumberWithCommas(selectedProduct?.buy_price || '')}
                            disabled
                          />
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup>
                          <Input
                            type="text"
                            value={formatNumberWithCommas(row_total_price)}
                            disabled
                          />
                        </FormGroup>
                      </td>
                      <td className="text-center">
                        {existsRow ? (
                          <>
                            {checkPermission(profile.data, rightsMapperData.transactionImportDeleteDetails) && (
                              <Button type="button" color="danger" size="sm" title={t('delete')} onClick={deleteExistsRow(item)}>
                                <FaTrash />
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            {i !== 0 && (
                              <Button type="button" color="danger" size="sm" title={t('delete')} onClick={deleteNewRow(i)}>
                                <FaTrash />
                              </Button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {total_rows ? (
                  <tr>
                    <td colSpan={6} />
                    <td className="text-center">{formatNumberWithCommas(total_rows)}</td>
                    <td />
                  </tr>
                ) : null}
              </tbody>
            </Table>
            <div className={styles.buttonsActions}>
              <Button type="button" color="secondary" className={styles.goBack} onClick={goBack} size="sm">
                <FaArrowLeft /> {t('go_back')}
              </Button>
              {!existsRow && (
                <Button type="submit" color="primary" className={styles.saveButton} size="sm">
                  <FaFloppyDisk /> {t('save')}
                </Button>
              )}
            </div>
          </Form>
        </Col>
      </Row>
      {loading && <Loading />}
      <ConfirmDialog isOpen={deleteDetail.isOpen} toggle={toggleExistsRow} confirm={confirmDeleteExistsRow} />
    </>
  );
}

export default CreateUpdateForm;
