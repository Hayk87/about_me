import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { FaPlus, FaMarker, FaTrash, FaFilter, FaLock, FaUnlock } from 'react-icons/fa6';
import queryString from "query-string";
import { rightsMapperData, useTranslate, applicationBaseURL, checkPermission, adminPagesPath } from '../../utils';
import { getSystemUsersList, deleteSystemUser, blockSystemUser, getStaffsList } from '../../api/requests';
import { RootState } from "../../store";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import SearchForm from "../../components/SearchForm";
import ConfirmDialog from "../../components/Confirm-dialog";
import { initListAndCount } from "../../store/slices/system-users";
import { useToast } from "../../hooks";
import styles from "./styles.module.scss";

export const path: string = adminPagesPath.systemUsers;
export const viewPagePermission: string = rightsMapperData.systemUserRead;

const itemsPerPage = 10;
const pagesSize = 5;

const fields = [
  { type: 'text', tr_key: 'first_name', key: 'first_name', style: { width: '20%' } },
  { type: 'text', tr_key: 'last_name', key: 'last_name', style: { width: '20%' } },
  { type: 'text', tr_key: 'email', key: 'email', style: { width: '20%' } },
  { type: 'select-one-searchbox', tr_key: 'staff_title', key: 'staff_id', style: { width: '20%' }, isMulti: false },
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
  const rows = useSelector((state: RootState) => state.systemUsers);
  const profile = useSelector((state: RootState) => state.profile);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const { t } = useTranslate();
  const pages = useMemo(() => Math.ceil(rows.count / itemsPerPage), [rows.count]);
  const page = useMemo(() => parseInt((parsed.page as string)) || 1, [parsed.page]);
  const staffs = options.staff_id?.map((item: any) => ({ value: item.staff_id, label: item.staff_title?.[lngCode] })) || [];

  const LIST = useMemo(() => rows.list, [rows.list]);

  const toggleFilterOpen = useCallback(() => setFilterOpen(prev => !prev), []);

  const addNewItem = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.systemUsersNew}${searchStr ? `?${searchStr}` : ''}`);
  }

  const editItem = (item: any) => () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.systemUsersDetailsId.replace(':id', item.system_user_id)}${searchStr ? `?${searchStr}` : ''}`);
  }

  const deleteItem = (item: any) => () => {
    setDeleteDialog({ isOpen: true, data: item });
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, data: null });
  }

  const confirmDeleteDialog = () => {
    deleteSystemUser(deleteDialog.data?.system_user_id)
      .then(() => {
        alertSuccess(t('successfully_deleted'));
        closeDeleteDialog();
        fetchData(location.search);
      })
      .catch(err => {
        console.log(err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      });
  }

  const blockItem = (item: any) => () => {
    blockSystemUser(item.system_user_id)
      .then((res) => {
        alertSuccess(t(res.data.is_blocked ? 'successfully_blocked' : 'successfully_unblocked'));
        closeDeleteDialog();
        fetchData(location.search);
      })
      .catch(err => {
        console.log('blockSystemUser error:', err);
        alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
      });
  }

  const fetchData = (loc: string) => {
    setLoading(true);
    const parsed = queryString.parse(loc);
    const lang = parsed.lng || languages.list.find(item => item.is_default)?.code;
    const search: any = { lang, page: (parsed.page as string) || 1, limit: itemsPerPage };
    for (const field of fields) {
      if (parsed[field.key]) {
        search[field.key] = parsed[field.key] as string;
      }
    }
    getSystemUsersList(search)
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
    fetchData(location.search);
  }, [location.search]);

  useEffect(() => {
    const getAll = { lang: lngCode, page: 1, all: 'on' };
    getStaffsList(getAll)
      .then(res => {
        setOptions({ staff_id: res.data.list });
      })
      .catch(err => {
        console.log("getStaffsList.err => ", err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      });
    return () => {
      dispatch(initListAndCount({ list: [], count: 0 }));
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.btns}>
          {checkPermission(profile.data, rightsMapperData.systemUserCreate) && (
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
          options={{ staff_id: staffs }}
          buttonsStyle={{ width: '20%' }}
        />
        <Table bordered striped>
          <thead>
          <tr>
            <th className="text-center">{t('first_name')}</th>
            <th className="text-center">{t('last_name')}</th>
            <th className="text-center">{t('email')}</th>
            <th className="text-center">{t('staff_title')}</th>
            <th className="text-center">{t('is_blocked')}</th>
            <th style={{ width: '500px', textAlign: 'center' }} />
          </tr>
          </thead>
          <tbody>
          {LIST.length ? (
            <>
              {LIST.map(item => (
                <tr key={item.system_user_id}>
                  <td className="text-center">{item.system_user_first_name}</td>
                  <td className="text-center">{item.system_user_last_name}</td>
                  <td className="text-center">{item.system_user_email}</td>
                  <td className="text-center">{item.staff_title?.[lngCode]}</td>
                  <td className="text-center">{t(item.system_user_is_blocked ? 'yes' : 'no')}</td>
                  <td style={{ textAlign: 'center' }}>
                    {checkPermission(profile.data, rightsMapperData.systemUserReadDetails) && (
                      <>
                        <Button type="button" className="text-center" color="primary" size="sm" onClick={editItem(item)}>
                          <FaMarker /> {t('edit')}
                        </Button>
                        &nbsp;&nbsp;
                      </>
                    )}
                    {checkPermission(profile.data, rightsMapperData.systemUserDelete) && (
                      <>
                        <Button type="button" className="text-center" color="danger" size="sm" onClick={deleteItem(item)}>
                          <FaTrash /> {t('delete')}
                        </Button>
                        &nbsp;&nbsp;
                      </>
                    )}
                    {checkPermission(profile.data, rightsMapperData.systemUserBlock) && (
                      <>
                        <Button type="button" className="text-center" color="warning" size="sm" onClick={blockItem(item)}>
                          {!item.system_user_is_blocked ? <FaLock /> : <FaUnlock />} {t('block_user')}
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
              <td colSpan={6} className="text-center">{t('data_not_found')}</td>
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
