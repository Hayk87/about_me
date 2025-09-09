import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from "react-redux";
import queryString from "query-string";
import { rightsMapperData, adminPagesPath, useTranslate, downloadFileFromBlob } from "../../utils";
import { getReportDetailsType, getReportTotalType, getProductsList, getSystemUsersList, getStaffsList } from '../../api/requests';
import { ReportDetailsType, ReportTotalType } from "../../interfaces";
import { useToast } from "../../hooks";
import SearchForm from "../../components/SearchForm";
import Loading from "../../components/Loading";
import { ReportResultViewDialog, ReportResultViewTotalityDialog } from "../../components/Report-result-view-dialog";
import { RootState } from "../../store";
import { useLocation } from "react-router-dom";

export const path: string = adminPagesPath.reports;
export const viewPagePermission: string = rightsMapperData.reportsPage;

const reportDetailsFields = [
  { type: 'select-one-searchbox', tr_key: 'report_result_type', key: 'resultType', isMulti: false },
  { type: 'select-one-searchbox', tr_key: 'report_report_type', key: 'reportType', isMulti: false },
  { type: 'date', tr_key: 'report_created_start', key: 'created_start' },
  { type: 'date', tr_key: 'report_created_end', key: 'created_end' },
  { type: 'float-positive-number', tr_key: 'report_amount_start', key: 'amount_start' },
  { type: 'float-positive-number', tr_key: 'report_amount_end', key: 'amount_end' },
  { type: 'select-multi-searchbox', tr_key: 'report_product_ids', key: 'product_ids', isMulti: true },
  { type: 'select-multi-searchbox', tr_key: 'report_operator_ids', key: 'operator_ids', isMulti: true },
  { type: 'select-multi-searchbox', tr_key: 'report_details_staff_ids', key: 'staff_ids', isMulti: true },
];

const reportTotalityFields = [
  { type: 'select-one-searchbox', tr_key: 'report_result_type', key: 'resultType', isMulti: false },
  { type: 'select-one-searchbox', tr_key: 'report_report_type', key: 'reportType', isMulti: false },
  { type: 'date', tr_key: 'report_created_start', key: 'created_start' },
  { type: 'date', tr_key: 'report_created_end', key: 'created_end' },
  { type: 'select-multi-searchbox', tr_key: 'report_operator_ids', key: 'operator_ids', isMulti: true },
];

const reportDetailsOptionsKeys = {
  resultType: ['result', 'xls', 'xlsx', 'csv'],
  reportType: ['imports', 'exports', 'both']
}

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [resultView1, setResultView1] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const [resultView2, setResultView2] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const [products, setProducts] = useState<any>([]);
  const [operators, setOperators] = useState<any>([]);
  const [staffs, setStaffs] = useState<any>([]);
  const location = useLocation();
  const translates = useSelector((state: RootState) => state.translates);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});
  const { t } = useTranslate();
  const { alertError } = useToast();
  const productsOptions = useMemo(() => products.map((p: any) => ({ value: p.id, label: p.category?.title?.[lngCode] + ' / ' +  p.title?.[lngCode] + ' / ' + p.measurement?.title?.[lngCode] })), [lngCode, products]);
  const operatorsOptions = useMemo(() => operators.map((usr: any) => ({ value: usr.system_user_id, label: [usr.system_user_first_name, usr.system_user_last_name, usr.system_user_email].join(' ') })), [operators]);
  const staffsOptions = useMemo(() => staffs.map((p: any) => ({ value: p.staff_id, label: p.staff_title?.[lngCode] })), [lngCode, staffs]);
  const reportDetailsOptions = useMemo(() => ({
    resultType: reportDetailsOptionsKeys.resultType.map(value => ({ value, label: value === 'result' ? t(`report_result_type_${value}`) : value.toUpperCase() })),
    reportType: reportDetailsOptionsKeys.reportType.map(value => ({ value, label: t(`report_report_type_${value}`) })),
    product_ids: productsOptions,
    operator_ids: operatorsOptions,
    staff_ids: staffsOptions,
  }), [lngCode, productsOptions, operatorsOptions]);
  const reportTotalityOptions = useMemo(() => ({
    resultType: reportDetailsOptionsKeys.resultType.map(value => ({ value, label: value === 'result' ? t(`report_result_type_${value}`) : value.toUpperCase() })),
    reportType: reportDetailsOptionsKeys.reportType.map(value => ({ value, label: t(`report_report_type_${value}`) })),
    operator_ids: operatorsOptions,
  }), [operatorsOptions]);

  const toggleResultView1 = () => setResultView1({ isOpen: false, data: null });

  const toggleResultView2 = () => setResultView2({ isOpen: false, data: null });

  const reportDetails = async (state: any) => {
    setLoading(true);
    setErrors1({});
    const data: ReportDetailsType = {
      ...state,
      product_ids: state.product_ids?.split(',').filter((item: any) => !!item).map((item: any) => Number(item)) || [],
      operator_ids: state.operator_ids?.split(',').filter((item: any) => !!item).map((item: any) => Number(item)) || [],
      staff_ids: state.staff_ids?.split(',').filter((item: any) => !!item).map((item: any) => Number(item)) || [],
    }
    const options: any = {};
    if (data.resultType !== 'result') {
      options.responseType = 'blob';
      data.lngCode = lngCode as string;
      data.trs = {
        report_by_details: translates.currentTranslates.report_by_details,
        report_report_type_imports: translates.currentTranslates.report_report_type_imports,
        report_report_type_exports: translates.currentTranslates.report_report_type_exports,
        created_at: translates.currentTranslates.created_at,
        transaction_amount: translates.currentTranslates.transaction_amount,
        system_user: translates.currentTranslates.system_user,
        staff_title: translates.currentTranslates.staff_title,
        product_categories: translates.currentTranslates.product_categories,
        products: translates.currentTranslates.products,
        products_quantity: translates.currentTranslates.products_quantity,
        measurement_title: translates.currentTranslates.measurement_title,
        products_buy_price: translates.currentTranslates.products_buy_price,
        products_sell_price: translates.currentTranslates.products_sell_price,
        products_income: translates.currentTranslates.products_income,
        total_price: translates.currentTranslates.total_price,
        total: translates.currentTranslates.total,
      };
    }
    getReportDetailsType(data, options)
      .then(res => {
        if (data.resultType !== 'result') {
          downloadFileFromBlob(res);
        } else {
          setResultView1({ isOpen: true, data: res.data });
        }
      })
      .catch(async err => {
        console.log('getReportDetailsType.error:', err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        } else {
          if (err.response.data.message) {
            return setErrors1(err.response.data.message);
          }
          let errors: any = await err.response.data.text();
          errors = JSON.parse(errors);
          setErrors1(errors.message);
        }
      })
      .finally(() => setLoading(false));
  }

  const reportTotal = (state: any) => {
    setLoading(true);
    setErrors2({});
    const data: ReportTotalType = {
      ...state,
      operator_ids: state.operator_ids?.split(',').filter((item: any) => !!item).map((item: any) => Number(item)) || [],
    }
    const options: any = {};
    if (data.resultType !== 'result') {
      options.responseType = 'blob';
      data.trs = {
        report_by_totality: translates.currentTranslates.report_by_totality,
        report_report_type_imports: translates.currentTranslates.report_report_type_imports,
        report_report_type_exports: translates.currentTranslates.report_report_type_exports,
        first_name: translates.currentTranslates.first_name,
        last_name: translates.currentTranslates.last_name,
        email: translates.currentTranslates.email,
        transaction_amount: translates.currentTranslates.transaction_amount,
        products_buy_price: translates.currentTranslates.products_buy_price,
        products_sell_price: translates.currentTranslates.products_sell_price,
        products_income: translates.currentTranslates.products_income,
        total: translates.currentTranslates.total,
      };
    }
    getReportTotalType(data, options)
      .then(res => {
        if (data.resultType !== 'result') {
          downloadFileFromBlob(res);
        } else {
          setResultView2({ isOpen: true, data: res.data });
        }
      })
      .catch(async err => {
        console.log('getReportDetailsType.error:', err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        } else {
          if (err.response.data.message) {
            return setErrors2(err.response.data.message);
          }
          let errors: any = await err.response.data.text();
          errors = JSON.parse(errors);
          setErrors2(errors.message);
        }
      })
      .finally(() => setLoading(false));
  }

  const initializePage = async () => {
    try {
      setLoading(true);
      const send: any = { page: 1, all: 'on', lang: lngCode };
      const _products = await getProductsList(send);
      const _systemUsers = await getSystemUsersList(send);
      const _staffs = await getStaffsList(send);
      setProducts(_products.data.list);
      setOperators(_systemUsers.data.list);
      setStaffs(_staffs.data.list);
    } catch (error: any) {
      console.log("initializePage.error => ", error);
      if (typeof error.response.data.message === 'string') {
        alertError(`${error.response.data.statusCode}: ${t(error.response.data.message)}`);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initializePage();
  }, []);

  return (
    <>
      <h2>{t('report_by_details')}</h2>
      <SearchForm
        fields={reportDetailsFields}
        options={reportDetailsOptions}
        filterErrors={errors1}
        buttonsStyle={{ width: '20%' }}
        searchBtnText={'view'}
        formSend={reportDetails}
        prefix={'by_details'}
        visible
        withoutQueryParamsChange
      />
      <br/>
      <h2>{t('report_by_totality')}</h2>
      <SearchForm
        fields={reportTotalityFields}
        options={reportTotalityOptions}
        filterErrors={errors2}
        buttonsStyle={{ width: '20%' }}
        searchBtnText={'view'}
        formSend={reportTotal}
        prefix={'by_totality'}
        visible
        withoutQueryParamsChange
      />
      {loading && <Loading />}
      <ReportResultViewDialog isOpen={resultView1.isOpen} data={resultView1.data} toggle={toggleResultView1} />
      <ReportResultViewTotalityDialog isOpen={resultView2.isOpen} data={resultView2.data} toggle={toggleResultView2} />
    </>
  );
}

export default Reports;
