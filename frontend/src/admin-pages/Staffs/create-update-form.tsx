import React, { useState, useEffect, useMemo } from "react";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col, Table } from 'reactstrap';
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import Loading from "../../components/Loading";
import { applicationBaseURL, useTranslate, rightsMapperData, checkPermission, adminPagesPath } from "../../utils";
import { getStaffById, createStaff, updateStaff, getAllRights } from "../../api/requests";
import { RootState } from "../../store";
import { useToast } from "../../hooks";
import styles from "./create-update-form-styles.module.scss";

interface CreateUpdateFormInterface {
  id?: string;
}

const CreateUpdateForm = ({ id }: CreateUpdateFormInterface): React.ReactElement => {
  const [state, setState] = useState<{ title: Record<string, string>, rights: number[] }>({ title: {}, rights: [] });
  const [errors, setErrors] = useState<any>({});
  const [rights, setRights] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useToast();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const updateUnavailable = !!(id && !checkPermission(profile.data, rightsMapperData.staffUpdate));
  const rightsOptions = useMemo(() => rights.map((right: any) => ({ label: right.title?.[lngCode] || right.title?.[defaultLang.code], value: right.id })), [rights, lngCode, defaultLang.code]);
  const rightsSelected = useMemo(() => rights
                                                .filter((right: any) => state.rights.includes(right.id))
                                                .map((right: any) => ({ label: right.title?.[lngCode] || right.title?.[defaultLang.code], value: right.id })),
                                          [rights, state.rights, lngCode, defaultLang.code]);

  const setValue = (lang: string) => (ev: any) => {
    setState(prev => ({ ...prev, title: { ...prev.title, [lang]: ev.target.value } }));
    setErrors((prev: any) => ({ ...prev, title: { ...prev.title, [lang]: '' } }));
  }

  const goBack = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.staffs}${searchStr ? `?${searchStr}` : ''}`);
  }

  const handleRights = (selectedRights: any) => {
    setState(prev => ({ ...prev, rights: selectedRights.map((item: any) => item.value) }));
    setErrors((prev: any) => ({ ...prev, rights: '' }));
  }

  const handleRightChange = (item: any) => (ev: any) => {
    if (ev.target.checked) {
      setState(prev => ({ ...prev, rights: [...prev.rights, item.value] }));
    } else {
      setState(prev => ({ ...prev, rights: prev.rights.filter(r => r !== item.value) }));
    }
    setErrors((prev: any) => ({ ...prev, rights: '' }));
  }

  const handleAllRightChange = (ev: any) => {
    if (ev.target.checked) {
      setState(prev => ({ ...prev, rights: rightsOptions.map((item: any) => item.value) }));
    } else {
      setState(prev => ({ ...prev, rights: [] }));
    }
    setErrors((prev: any) => ({ ...prev, rights: '' }));
  }

  const handleSave = (ev: any) => {
    ev.preventDefault();
    if (updateUnavailable) return;
    setLoading(true);
    setErrors({});
    let promise = null;
    if (id) {
      promise = updateStaff(id, state);
    } else {
      promise = createStaff(state);
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
    getAllRights()
      .then(res => {
        setRights(res.data);
      })
      .catch(err => {
        console.log('getAllRights.error: ', err.response.data.message);
        alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
      });
    if (id) {
      setLoading(true);
      getStaffById(id)
        .then(res => {
          setState({ title: res.data.title, rights: res.data.rights.map((r: any) => r.id) });
        })
        .catch(err => {
          console.log('getStaffById.err: ', err.response.data.message);
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
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
                <Label for={`title_${lang.code}`}>{`${t('naming')} (${lang.name})`}</Label>
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
        </Row>
        <Row>
          <Col>
            <Table className={styles.staffRightsTbl} border={1} bordered striped>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleAllRightChange} checked={rightsOptions.length === rightsSelected.length} />
                  </th>
                  <th>
                    {t("staff_rights")}
                    {errors.rights && (
                      <>
                        &nbsp;&nbsp;
                        <span className="text-danger">{t(errors.rights)}</span>
                      </>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
              {rightsOptions.map((item: any) => (
                <tr key={item.value}>
                  <td>
                    <input
                      type="checkbox"
                      id={`right-${item.value}`}
                      onChange={handleRightChange(item)}
                      checked={state.rights.includes(item.value)}
                    />
                  </td>
                  <td>
                    <label htmlFor={`right-${item.value}`}>{item.label}</label>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
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
