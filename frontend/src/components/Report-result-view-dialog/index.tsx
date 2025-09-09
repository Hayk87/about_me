import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import { FaPrint, FaX } from 'react-icons/fa6';
import { useTranslate, formatNumberWithCommas } from "../../utils";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import queryString from "query-string";

interface ReportResultViewInterface {
  isOpen: boolean;
  toggle: any;
  data: any;
}

interface ReportResultViewTotalityInterface {
  isOpen: boolean;
  toggle: any;
  data: any;
}

interface ReportTableInterface {
  data: any;
  lngCode: string;
  title: string;
  type: 'import' | 'export'
}

interface ReportTableTotalityInterface {
  data: any;
  lngCode: string;
  title: string;
  type: 'import' | 'export'
}

export const ReportResultViewDialog = (props: ReportResultViewInterface) => {
  const location = useLocation();
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const { t } = useTranslate();

  const printContent = () => {
    const modalBody = document.querySelector(`.${styles.ReportResultViewDialog} .modal-body`);
    const root = document.getElementById('root');
    const modal = document.querySelector('.modal') as HTMLDivElement;
    if (root) {
      root.style.display = 'none';
    }
    if (modal) {
      modal.style.display = 'none';
    }
    const div = document.createElement('div');
    div.innerHTML = modalBody?.innerHTML || '';
    document.body.appendChild(div);
    window.print();
    div.remove();
    if (root) {
      root.style.display = 'block';
    }
    if (modal) {
      modal.style.display = 'block';
    }
  }

  return (
      <Modal isOpen={props.isOpen} toggle={props.toggle} className={styles.ReportResultViewDialog}>
        <ModalHeader toggle={props.toggle}>{t('report_by_details')}</ModalHeader>
        <ModalBody>
          <ReportTableContent data={props.data?.resultsImports} lngCode={lngCode} title={'report_report_type_imports'} type={'import'} />
          <ReportTableContent data={props.data?.resultsExports} lngCode={lngCode} title={'report_report_type_exports'} type={'export'} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={printContent} color="success">
            <FaPrint /> {t('print')}
          </Button>
          <Button onClick={props.toggle} color="secondary">
            <FaX />{t('close')}
          </Button>
        </ModalFooter>
      </Modal>
  );
}

const ReportTableContent = (props: ReportTableInterface) => {
  const { t } = useTranslate();
  const forExport = props.type === 'export';
  return (
    <>
      {props.data ? (
        <Table bordered>
          <thead>
          <tr>
            <th colSpan={4} className="text-center">{t(props.title)}</th>
          </tr>
          <tr>
            <th>{t('created_at')}</th>
            <th>{t('transaction_amount')}</th>
            <th>{t('system_user')}</th>
            <th>{t('staff_title')}</th>
          </tr>
          </thead>
          <tbody>
          {props.data.length ? props.data.map((item: any) => {
            let incomeTotal = 0;
            let buyAmountTotal = 0;
            let sellAmountTotal = 0;
            return (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{dayjs(item.created).format('DD/MM/YYYY')}</td>
                  <td>{formatNumberWithCommas(item.amount)}</td>
                  <td>{item.operator.first_name + ' ' + item.operator.last_name}</td>
                  <td>{item.operator.staff?.title?.[props.lngCode]}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <Table bordered>
                      <thead>
                      <tr>
                        <th>{t('products')}</th>
                        <th>{t('products_quantity')}</th>
                        {forExport ? (
                          <>
                            <th>{t('products_buy_price')}</th>
                            <th>{t('total')} / {t('products_buy_price')}</th>
                            <th>{t('products_sell_price')}</th>
                            <th>{t('total')} / {t('products_sell_price')}</th>
                            <th>{t('total')} / {t('products_income')}</th>
                          </>
                        ) : (
                          <>
                            <th>{t('products_buy_price')}</th>
                            <th>{t('total_price')}</th>
                          </>
                        )}
                      </tr>
                      </thead>
                      <tbody>
                      {item.details.map((row: any) => {
                        const buyAmount = forExport ? row.buy_price * row.count : 0;
                        const amount = forExport ? row.price * row.count : row.amount;
                        const income = forExport ? (row.price - row.buy_price) * row.count : 0;
                        buyAmountTotal += buyAmount;
                        sellAmountTotal += amount;
                        incomeTotal += income;
                        return (
                          <tr>
                            <td>{row.product_category.title?.[props.lngCode]} / {row.product.title?.[props.lngCode]}</td>
                            <td>{formatNumberWithCommas(row.count)} {row.measurement.title?.[props.lngCode]}</td>
                            {forExport ? (
                              <>
                                <td>{formatNumberWithCommas(row.buy_price)}</td>
                                <td>{formatNumberWithCommas(buyAmount)}</td>
                                <td>{formatNumberWithCommas(row.price)}</td>
                                <td>{formatNumberWithCommas(amount)}</td>
                                <td>{formatNumberWithCommas(income)}</td>
                              </>
                            ) : (
                              <>
                                <td>{formatNumberWithCommas(row.price)}</td>
                                <td>{formatNumberWithCommas(row.amount)}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      {forExport ? (
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td>{formatNumberWithCommas(buyAmountTotal)}</td>
                          <td />
                          <td>{formatNumberWithCommas(sellAmountTotal)}</td>
                          <td>{formatNumberWithCommas(incomeTotal)}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={3} />
                          <td>{formatNumberWithCommas(sellAmountTotal)}</td>
                        </tr>
                      )}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              </React.Fragment>
            );
          }) : (
            <tr>
              <td colSpan={4} className="text-center">{t('data_not_found')}</td>
            </tr>
          )}
          </tbody>
        </Table>
      ) : null}
    </>
  )
}

export const ReportResultViewTotalityDialog = (props: ReportResultViewTotalityInterface) => {
  const location = useLocation();
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const { t } = useTranslate();

  const printContent = () => {
    const modalBody = document.querySelector(`.${styles.ReportResultViewDialog} .modal-body`);
    const root = document.getElementById('root');
    const modal = document.querySelector('.modal') as HTMLDivElement;
    if (root) {
      root.style.display = 'none';
    }
    if (modal) {
      modal.style.display = 'none';
    }
    const div = document.createElement('div');
    div.innerHTML = modalBody?.innerHTML || '';
    document.body.appendChild(div);
    window.print();
    div.remove();
    if (root) {
      root.style.display = 'block';
    }
    if (modal) {
      modal.style.display = 'block';
    }
  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle} className={styles.ReportResultViewDialog}>
      <ModalHeader toggle={props.toggle}>{t('report_by_totality')}</ModalHeader>
      <ModalBody>
        <ReportTableTotalityContent data={props.data?.resultsImports} lngCode={lngCode} title={'report_report_type_imports'} type={'import'} />
        <ReportTableTotalityContent data={props.data?.resultsExports} lngCode={lngCode} title={'report_report_type_exports'} type={'export'} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={printContent} color="success">
          <FaPrint /> {t('print')}
        </Button>
        <Button onClick={props.toggle} color="secondary">
          <FaX />{t('close')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const ReportTableTotalityContent = (props: ReportTableTotalityInterface) => {
  const { t } = useTranslate();
  const forExport = props.type === 'export';
  let incomeTotal = 0;
  let amountTotal = 0;
  return (
    <>
      {props.data ? (
        <Table bordered>
          <thead>
          <tr>
            <th colSpan={forExport ? 6 : 4} className="text-center">{t(props.title)}</th>
          </tr>
          <tr>
            <th>{t('first_name')}</th>
            <th>{t('last_name')}</th>
            <th>{t('email')}</th>
            {forExport ? (
              <>
                <th>{t('products_buy_price')}</th>
                <th>{t('products_sell_price')}</th>
                <th>{t('products_income')}</th>
              </>
            ) : (
              <th>{t('transaction_amount')}</th>
            )}
          </tr>
          </thead>
          <tbody>
          {props.data.length ? (
            <>
              {props.data.map((item: any) => {
                const income = item.sell_amount - item.buy_amount;
                incomeTotal += income;
                amountTotal += item.total_amount;
                return (
                  <tr key={item.operator_id}>
                    <td>{item.operator_first_name} {item.id}</td>
                    <td>{item.operator_last_name}</td>
                    <td>{item.operator_email}</td>
                    {forExport ? (
                      <>
                        <td>{formatNumberWithCommas(item.buy_amount)}</td>
                        <td>{formatNumberWithCommas(item.sell_amount)}</td>
                        <td>{formatNumberWithCommas(income)}</td>
                      </>
                    ) : (
                      <td>{formatNumberWithCommas(item.total_amount)}</td>
                    )}
                  </tr>
                );
              })}
              {forExport ? (
                <tr>
                  <td colSpan={5} />
                  <td>{formatNumberWithCommas(incomeTotal)}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={3} />
                  <td>{formatNumberWithCommas(amountTotal)}</td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={forExport ? 6 : 4} className="text-center">{t('data_not_found')}</td>
            </tr>
          )}
          </tbody>
        </Table>
      ) : null}
    </>
  )
}
