import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import dayjs from 'dayjs';
import { FaPlus, FaEye, FaTrash, FaFilter } from 'react-icons/fa6';
import queryString from "query-string";
import {
  rightsMapperData,
  useTranslate,
  applicationBaseURL,
  checkPermission,
  formatNumberWithCommas,
  adminPagesPath
} from "../../utils";
import { getTransactionExportsList, deleteTransactionExport, getSystemUsersList } from '../../api/requests';
import { RootState } from "../../store";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import SearchForm from "../../components/SearchForm";
import ConfirmDialog from "../../components/Confirm-dialog";
import { initListAndCount } from "../../store/slices/transaction-exports";
import { useToast } from "../../hooks";
import styles from "./styles.module.scss";

export const path: string = adminPagesPath.transactionExports;
export const viewPagePermission: string = rightsMapperData.transactionExportRead;

const itemsPerPage = 10;
const pagesSize = 5;

const fields = [
  { type: 'date', tr_key: 'tr_created_from', key: 'created_from', style: { width: '25%' } },
  { type: 'date', tr_key: 'tr_created_to', key: 'created_to', style: { width: '25%' } },
  { type: 'float-positive-number', tr_key: 'amount_from', key: 'amount_from', style: { width: '25%' } },
  { type: 'float-positive-number', tr_key: 'amount_to', key: 'amount_to', style: { width: '25%' } },
  { type: 'select-one-searchbox', tr_key: 'system_user', key: 'system_user_id', style: { width: '25%' }, isMulti: false },
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const [options, setOptions] = useState<any>({});
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertError, alertSuccess } = useToast();
  const languages = useSelector((state: RootState) => state.languages);
  const rows = useSelector((state: RootState) => state.transactionExports);
  const profile = useSelector((state: RootState) => state.profile);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const { t } = useTranslate();
  const pages = useMemo(() => Math.ceil(rows.count / itemsPerPage), [rows.count]);
  const page = useMemo(() => parseInt((parsed.page as string)) || 1, [parsed.page]);
  const users = options.operator_id?.map((item: any) => ({ value: item.system_user_id, label: `${item.system_user_first_name} ${item.system_user_last_name} / ${item.system_user_email}` })) || [];

  const LIST = useMemo(() => rows.list, [rows.list]);

  const toggleFilterOpen = useCallback(() => setFilterOpen(prev => !prev), []);

  const addNewItem = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.transactionExportsNew}${searchStr ? `?${searchStr}` : ''}`);
  }

  const editItem = (item: any) => () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.transactionExportsDetailsId.replace(':id', item.id)}${searchStr ? `?${searchStr}` : ''}`);
  }

  const deleteItem = (item: any) => () => {
    setDeleteDialog({ isOpen: true, data: item });
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, data: null });
  }

  const confirmDeleteDialog = () => {
    deleteTransactionExport(deleteDialog.data?.id)
      .then(() => {
        alertSuccess(t('successfully_deleted'));
        closeDeleteDialog();
        fetchData();
      })
      .catch(err => {
        console.log(err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      });
  }

  const fetchData = () => {
    setLoading(true);
    const lang = parsed.lng || languages.list.find(item => item.is_default)?.code;
    const search: any = { lang, page: (parsed.page as string) || 1, limit: itemsPerPage };
    for (const field of fields) {
      if (parsed[field.key]) {
        search[field.key] = parsed[field.key] as string;
      }
    }
    getTransactionExportsList(search)
      .then(res => {
        dispatch(initListAndCount({ list: res.data.list, count: res.data.count }));
      })
      .catch(err => {
        console.log("err => ", err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      })
      .finally(() => setLoading(false));
  }

  const goToPage = (p: string) => {
    parsed.page = p as string;
    const searchStr = queryString.stringify(parsed);
    navigate(`${location.pathname}${searchStr ? `?${searchStr}` : ''}`);
  }

  useEffect(() => {
    fetchData();
  }, [location.search]);

  useEffect(() => {
    const getAll = { lang: lngCode, page: 1, all: 'on' };
    getSystemUsersList(getAll)
      .then(res => {
        setOptions({ operator_id: res.data.list });
      })
      .catch(err => {
        console.log("getSystemUsersList.err => ", err);
      });
    return () => {
      dispatch(initListAndCount({ list: [], count: 0 }));
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.btns}>
          {checkPermission(profile.data, rightsMapperData.transactionExportCreate) && (
            <Button type="button" color="success" size="sm" onClick={addNewItem}>
              <FaPlus /> {t('add')}
            </Button>
          )}
          <Button type="button" color="info" size="sm" onClick={toggleFilterOpen}>
            <FaFilter /> {t('filter')}
          </Button>
        </div>
        <SearchForm
          visible={filterOpen}
          fields={fields}
          options={{ system_user_id: users }}
          buttonsStyle={{ width: '20%' }}
        />
        <Table bordered striped>
          <thead>
          <tr>
            <th className="text-center">{t('transaction_created')}</th>
            <th className="text-center">{t('transaction_amount')}</th>
            <th className="text-center">{t('first_name')}</th>
            <th className="text-center">{t('last_name')}</th>
            <th className="text-center">{t('email')}</th>
            <th className="text-center">{t('staff_title')}</th>
            <th style={{ width: '250px', textAlign: 'center' }} />
          </tr>
          </thead>
          <tbody>
          {LIST.length ? (
            <>
              {LIST.map(item => (
                <tr key={item.id}>
                  <td className="text-center">{dayjs(item.created).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td className="text-center">{item.amount ? formatNumberWithCommas(item.amount) : ''}</td>
                  <td className="text-center">{item.operator_first_name}</td>
                  <td className="text-center">{item.operator_last_name}</td>
                  <td className="text-center">{item.operator_email}</td>
                  <td className="text-center">{item.staff_title?.[lngCode]}</td>
                  <td style={{ textAlign: 'center' }}>
                    {checkPermission(profile.data, rightsMapperData.transactionExportReadDetails) && (
                      <>
                        <Button type="button" className="text-center" color="primary" size="sm" onClick={editItem(item)}>
                          <FaEye /> {t('view')}
                        </Button>
                        &nbsp;&nbsp;
                      </>
                    )}
                    {checkPermission(profile.data, rightsMapperData.transactionExportDelete) && (
                      <>
                        <Button type="button" className="text-center" color="danger" size="sm" onClick={deleteItem(item)}>
                          <FaTrash /> {t('delete')}
                        </Button>
                        &nbsp;&nbsp;
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={7} className="text-center">{t('data_not_found')}</td>
            </tr>
          )}
          </tbody>
        </Table>
        <div className={styles.paginationContainer}>
          <Pagination pages={pages} page={page} pagesSize={pagesSize} goTo={goToPage} />
        </div>
      </div>
      {loading && <Loading />}
      <ConfirmDialog isOpen={deleteDialog.isOpen} toggle={closeDeleteDialog} confirm={confirmDeleteDialog} />
    </>
  );
}
