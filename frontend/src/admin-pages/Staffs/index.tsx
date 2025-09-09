import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { FaPlus, FaMarker, FaTrash, FaFilter } from 'react-icons/fa6';
import queryString from "query-string";
import { rightsMapperData, useTranslate, applicationBaseURL, checkPermission, adminPagesPath } from '../../utils';
import { getStaffsList, deleteStaff } from '../../api/requests';
import { RootState } from "../../store";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import SearchForm from "../../components/SearchForm";
import ConfirmDialog from "../../components/Confirm-dialog";
import { initListAndCount } from "../../store/slices/staffs";
import { useToast } from "../../hooks";
import styles from "./styles.module.scss";

export const path: string = adminPagesPath.staffs;
export const viewPagePermission: string = rightsMapperData.staffRead;

const itemsPerPage = 10;
const pagesSize = 5;

const fields = [
  { type: 'text', tr_key: 'naming', key: 'title' },
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertError, alertSuccess } = useToast();
  const languages = useSelector((state: RootState) => state.languages);
  const rows = useSelector((state: RootState) => state.staffs);
  const profile = useSelector((state: RootState) => state.profile);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const { t } = useTranslate();
  const pages = useMemo(() => Math.ceil(rows.count / itemsPerPage), [rows.count]);
  const page = useMemo(() => parseInt((parsed.page as string)) || 1, [parsed.page]);

  const LIST = useMemo(() => rows.list, [rows.list]);

  const toggleFilterOpen = useCallback(() => setFilterOpen(prev => !prev), []);

  const addNewItem = () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.staffsNew}${searchStr ? `?${searchStr}` : ''}`);
  }

  const editItem = (item: any) => () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.staffsDetailsId.replace(':id', item.staff_id)}${searchStr ? `?${searchStr}` : ''}`);
  }

  const deleteItem = (item: any) => () => {
    setDeleteDialog({ isOpen: true, data: item });
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, data: null });
  }

  const confirmDeleteDialog = () => {
    deleteStaff(deleteDialog.data?.staff_id)
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
    if (parsed.title) {
      search.title = parsed.title as string;
    }
    getStaffsList(search)
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
    return () => {
      dispatch(initListAndCount({ list: [], count: 0 }));
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.btns}>
          {checkPermission(profile.data, rightsMapperData.staffCreate) && (
            <Button type="button" color="success" size="sm" onClick={addNewItem}>
              <FaPlus /> {t('add')}
            </Button>
          )}
          <Button type="button" color="info" size="sm" onClick={toggleFilterOpen}>
            <FaFilter /> {t('filter')}
          </Button>
        </div>
        <SearchForm visible={filterOpen} fields={fields} />
        <Table bordered striped>
          <thead>
          <tr>
            <th className="text-center">{t('naming')}</th>
            <th style={{ width: '220px', textAlign: 'center' }} />
          </tr>
          </thead>
          <tbody>
          {LIST.length ? (
            <>
              {LIST.map(item => (
                <tr key={item.staff_id}>
                  <td className="text-center">{item.staff_title?.[lngCode]}</td>
                  <td style={{ textAlign: 'center' }}>
                    {checkPermission(profile.data, rightsMapperData.staffReadDetails) && (
                      <>
                        <Button type="button" className="text-center" color="primary" size="sm" onClick={editItem(item)}>
                          <FaMarker /> {t('edit')}
                        </Button>
                        &nbsp;&nbsp;
                      </>
                    )}
                    {checkPermission(profile.data, rightsMapperData.staffDelete) && (
                      <Button type="button" className="text-center" color="danger" size="sm" onClick={deleteItem(item)}>
                        <FaTrash /> {t('delete')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={2} className="text-center">{t('data_not_found')}</td>
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
