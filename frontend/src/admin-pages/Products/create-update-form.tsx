import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import Loading from "../../components/Loading";
import { CloseIcon } from "../../components/Icons";
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
import { productsDetailsId } from "../../utils/admin-pages-path";

interface CreateUpdateFormInterface {
  id?: string;
}

interface IFile {
  id: string;
  name: string;
  type: string;
  directory: string;
  size: number;
}

interface OptionsInterface { category_id: { value: number, title: string }[] }

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
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

  const setTextAreaValue = (lang: string, key: 'title' | 'content') => (value: string) => {
    setState((prev: any) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
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

  const handleFilesChange = (ev: any) => {
    const { files } = ev.target;
    const filesData: any = [];
    for (const file of files) {
      filesData.push(file);
    }
    setState((prev: any) => ({ ...prev, files: filesData }));
  }

  const handleOption = (key: string) => (option: any) => {
    setState((prev: any) => ({ ...prev, [key]: option?.value }));
    setErrors((prev: any) => ({ ...prev, [key]: '' }));
  }

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.products}${searchStr ? `?${searchStr}` : ''}`);
  }

  const removeFile = (file: IFile) => () => {
    setRemovedFiles(prev => ([ ...prev, file.id ]));
  }

  const initializeProduct = () => {
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
            existsFiles: res.data.files,
          });
        })
        .catch(err => {
          console.log(err.response.data.message);
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (updateUnavailable) return;
    setLoading(true);
    setErrors({});
    let promise = null;
    const send = new FormData();
    send.append('category_id', state.category_id);
    send.append('code', state.code);
    send.append('title', JSON.stringify(state.title));
    send.append('content', JSON.stringify(state.content));
    send.append('price', state.price);
    for (const file of (state.files || [])) {
      send.append('files', file);
    }
    if (id) {
      send.append('removedFiles', JSON.stringify(removedFiles));
      promise = updateProduct(id, send);
    } else {
      promise = createProduct(send);
    }
    promise
      .then((res) => {
        alertSuccess(t('successfully_saved'));
        if (!id) {
          navigate(`/${applicationBaseURL}/${adminPagesPath.productsDetailsId.replace(':id', res.data.id)}`);
        } else {
          initializeProduct();
        }
      })
      .catch(err => {
        if (typeof err.response.data.message === 'object') {
          setErrors(err.response.data.message);
        } else {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    initializeProduct();
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
        <Col md={1} />
        <Col md={10}>
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
            <ButtonGroup className="mb-3">
              {languages.list.map((lang, i: number) => (
                <Button
                  type="button"
                  key={lang.code}
                  color="success"
                  outline={!(i === tab)}
                  onClick={() => setTab(i)}
                >
                  {lang.name}
                </Button>
              ))}
            </ButtonGroup>
            {languages.list.map((lang, i: number) => (
              <React.Fragment key={lang.code}>
                <FormGroup style={i === tab ? {} : { display: 'none' }}>
                  <Label for={`title_${lang.code}`}>{t('naming')}</Label>
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
                <FormGroup style={i === tab ? {} : { display: 'none' }}>
                  <Label for={`content_${lang.code}`}>{t('content')}</Label>
                  <Editor
                    id={`content_${lang.code}`}
                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                    value={state.content?.[lang.code] || ''}
                    onEditorChange={setTextAreaValue(lang.code, 'content')}
                    disabled={updateUnavailable}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size: 14px }'
                    }}
                  />
                  {errors.content?.[lang.code] && <FormFeedback>{t(errors.content?.[lang.code])}</FormFeedback>}
                </FormGroup>
              </React.Fragment>
            ))}
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
            <FormGroup>
              <Label for="files">Files: <small>(Please choose jpeg, jpg, png files up to 10MB each one)</small></Label>
              <Input
                type="file"
                name="files"
                id="files"
                onChange={handleFilesChange}
                multiple={true}
                accept={"image/jpeg,image/png"}
                invalid={!!errors.files}
              />
              {errors.files && <FormFeedback>{t(errors.files)}</FormFeedback>}
            </FormGroup>
            {id && state.existsFiles && (
              <div className={styles.productFiles}>
                {state.existsFiles
                  .filter((file: IFile) => !removedFiles.includes(file.id))
                  .map((file: IFile) => {
                    const url = `${process.env.REACT_APP_UPLOADED_FILES_BASE_URL || ''}/api/files/details/${file.id}`;
                    return (
                      <div key={file.id} className={styles.productFile}>
                        <a href={url} target="_blank">
                          <img src={url} alt={file.name} title={file.name} width={150} />
                        </a>
                        <span className={styles.remove} onClick={removeFile(file)}><CloseIcon /></span>
                      </div>
                    );
                })}
              </div>
            )}
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
