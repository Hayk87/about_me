import React, { useMemo, useState } from "react";
import { FaSistrix, FaRotateRight } from 'react-icons/fa6';
import { Input, Form, FormGroup, FormFeedback, Label, Button } from "reactstrap";
import dayjs from 'dayjs';
import DatePicker from "react-datepicker";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import Select from 'react-select';
import { useTranslate, classnames, floatPositiveNumberRegexp } from "../../utils";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.scss";

interface FieldInterface {
  type: string;
  tr_key: string;
  key: string;
  style?: Record<string, string>;
  isMulti?: boolean;
  options?: any[];
}

interface SearchFormInterface {
  visible: boolean;
  fields: FieldInterface[];
  options?: any;
  filterErrors?: any;
  buttonsStyle?: Record<string, string>;
  searchBtnText?: string;
  formSend?: Function;
  withoutQueryParamsChange?: boolean;
  prefix?: string;
}

const SearchForm = (props: SearchFormInterface) => {
  const location = useLocation();
  const parsed = queryString.parse(location.search) as Record<string, string>;
  const [state, setState] = useState<Record<string, string>>(parsed);
  const navigate = useNavigate();
  const { t } = useTranslate();

  const prefix = useMemo(() => props.prefix ? `_${props.prefix}` : '', [props.prefix]);

  const handleTextField = (key: string) => (ev: any) => {
    setState(prev => ({ ...prev, [key]: ev.target.value }))
  }

  const handleFloatPositiveField = (key: string) => (ev: any) => {
    const { value } = ev.target;
    if (value && !floatPositiveNumberRegexp.test(value)) {
      return;
    }
    setState(prev => ({ ...prev, [key]: value }));
  }

  const handleOption = (key: string) => (option: any) => {
    let OPTIONS = option;
    if (!Array.isArray(OPTIONS)) {
      OPTIONS = OPTIONS ? [OPTIONS] : [];
    }
    const value = OPTIONS?.map((o: any) => o.value).join(',');
    setState(prev => ({ ...prev, [key]: value }));
  }

  const handleDate: any = (key: string) => (date: Date) => {
    const value = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setState(prev => ({ ...prev, [key]: value }));
  }

  const handleSearch = (ev: any) => {
    ev.preventDefault();
    if (props.formSend) {
      props.formSend(state);
    }
    if (!props.withoutQueryParamsChange) {
      const parseObj = { ...parsed, ...state, page: 1, t: Date.now() };
      const searchStr = queryString.stringify(parseObj);
      navigate(`${location.pathname}${searchStr ? `?${searchStr}` : ''}`);
    }
  }

  const resetForm = () => {
    if (!props.withoutQueryParamsChange) {
      const parsed = queryString.parse(location.search);
      const urlParams: any = {};
      if (parsed.lng) {
        urlParams.lng = parsed.lng;
      }
      urlParams.page = 1;
      urlParams.t = Date.now();
      const q = queryString.stringify(urlParams);
      navigate(`${location.pathname}?${q}`);
    }
    setState({});
  }

  return (
    <>
      {props.fields.length ? (
        <Form onSubmit={handleSearch} className={classnames({ [styles.searchForm]: true, 'd-none': !props.visible })}>
          {props.fields.map((field, i) => {
            switch (field.type) {
              case 'text':
                return (
                  <FormGroup key={field.tr_key + i} style={field.style}>
                    <Label htmlFor={field.tr_key + prefix}>{t(field.tr_key)}</Label>
                    <Input
                      type="text"
                      id={field.tr_key + prefix}
                      onChange={handleTextField(field.key)} value={state[field.key] || ''}
                      invalid={!!props.filterErrors?.[field.key]}
                    />
                    {props.filterErrors?.[field.key] && <FormFeedback>{t(props.filterErrors?.[field.key])}</FormFeedback>}
                  </FormGroup>
                );
              case 'float-positive-number':
                return (
                  <FormGroup key={field.tr_key + i} style={field.style}>
                    <Label htmlFor={field.tr_key + prefix}>{t(field.tr_key)}</Label>
                    <Input
                      type="text"
                      id={field.tr_key + prefix}
                      onChange={handleFloatPositiveField(field.key)} value={state[field.key] || ''}
                      invalid={!!props.filterErrors?.[field.key]}
                    />
                    {props.filterErrors?.[field.key] && <FormFeedback>{t(props.filterErrors?.[field.key])}</FormFeedback>}
                  </FormGroup>
                );
              case 'select-one-searchbox':
              case 'select-multi-searchbox':
                const options = props.options?.[field.key] || [];
                const valueOptions = state[field.key]?.split(',') || [];
                const cb = (o: any) => valueOptions.includes(o.value.toString());
                const selectedOption = field.isMulti ? options.filter(cb) : options.find(cb);
                return (
                  <FormGroup key={field.tr_key + i} style={field.style}>
                    <Label htmlFor={field.tr_key + prefix}>{t(field.tr_key)}</Label>
                    <Select
                      id={field.tr_key + prefix}
                      isMulti={field.isMulti}
                      options={options}
                      placeholder={t(field.tr_key)}
                      onChange={handleOption(field.key)}
                      value={selectedOption || null}
                      isClearable
                    />
                    {props.filterErrors?.[field.key] && <div className="text-danger">{t(props.filterErrors?.[field.key])}</div>}
                  </FormGroup>
                );
              case 'date':
                const selected = state[field.key] ? new Date(state[field.key]) : null;
                return (
                  <FormGroup key={field.tr_key + i} style={field.style}>
                    <Label htmlFor={field.tr_key + prefix}>{t(field.tr_key)}</Label>
                    <DatePicker onChange={handleDate(field.key)} selected={selected} dateFormat={'dd/MM/yyyy'} id={field.tr_key + prefix} />
                    {props.filterErrors?.[field.key] && <div className="text-danger">{t(props.filterErrors?.[field.key])}</div>}
                  </FormGroup>
                );
              default:
                return null;
            }
          })}
          <FormGroup className={styles.buttons} style={props.buttonsStyle}>
            <Button type="submit" size="sm" color="primary"><FaSistrix /> {t(props.searchBtnText || 'search')}</Button>
            <Button type="button" size="sm" color="warning" onClick={resetForm}><FaRotateRight /> {t('reset')}</Button>
          </FormGroup>
        </Form>
      ) : null}
    </>
  );
}

export default SearchForm;
