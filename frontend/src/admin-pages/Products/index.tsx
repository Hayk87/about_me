import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { FaPlus, FaMarker, FaTrash, FaFilter } from 'react-icons/fa6';
import queryString from "query-string";
import { rightsMapperData, useTranslate, applicationBaseURL, checkPermission, formatNumberWithCommas, adminPagesPath } from '../../utils';
import { getProductsList, deleteProduct, getProductsCategoriesList } from '../../api/requests';
import { RootState } from "../../store";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import SearchForm from "../../components/SearchForm";
import ConfirmDialog from "../../components/Confirm-dialog";
import { initListAndCount } from "../../store/slices/products";
import { useToast } from "../../hooks";
import styles from "./styles.module.scss";

export const path: string = adminPagesPath.products;
export const viewPagePermission: string = rightsMapperData.productRead;

const itemsPerPage = 10;
const pagesSize = 5;

const fields = [
  { type: 'select-one-searchbox', tr_key: 'category_title', key: 'category_id', style: { width: '20%' }, isMulti: false },
  { type: 'text', tr_key: 'naming', key: 'title', style: { width: '20%' } },
  { type: 'text', tr_key: 'products_code', key: 'code', style: { width: '20%' } },
  { type: 'float-positive-number', tr_key: 'price_from', key: 'price_from', style: { width: '20%' } },
  { type: 'float-positive-number', tr_key: 'price_to', key: 'price_to', style: { width: '20%' } },
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const [filterErrors, setFilterErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<any>({});
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertError, alertSuccess } = useToast();
  const languages = useSelector((state: RootState) => state.languages);
  const rows = useSelector((state: RootState) => state.products);
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
    navigate(`/${applicationBaseURL}/${adminPagesPath.productsNew}${searchStr ? `?${searchStr}` : ''}`);
  }

  const editItem = (item: any) => () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.productsDetailsId.replace(':id', item.id)}${searchStr ? `?${searchStr}` : ''}`);
  }

  const deleteItem = (item: any) => () => {
    setDeleteDialog({ isOpen: true, data: item });
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, data: null });
  }

  const confirmDeleteDialog = () => {
    deleteProduct(deleteDialog.data?.id)
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

  const fetchData = (loc: string) => {
    setLoading(true);
    setFilterErrors({});
    const parsed = queryString.parse(loc);
    const lang = parsed.lng || languages.list.find(item => item.is_default)?.code;
    const search: any = { lang, page: (parsed.page as string) || 1, limit: itemsPerPage };
    for (const field of fields) {
      if (parsed[field.key]) {
        search[field.key] = parsed[field.key] as string;
      }
    }
    getProductsList(search)
      .then(res => {
        dispatch(initListAndCount({ list: res.data.list, count: res.data.count }));
      })
      .catch(err => {
        console.log("err => ", err);
        if (typeof err.response.data.message === 'string') {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        } else {
          setFilterErrors(err.response.data.message);
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

  useEffect(() => {
    return () => {
      dispatch(initListAndCount({ list: [], count: 0 }));
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.btns}>
          {checkPermission(profile.data, rightsMapperData.productCreate) && (
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
          options={options}
          filterErrors={filterErrors}
          buttonsStyle={{ width: '20%' }}
        />
        <Table bordered striped>
          <thead>
          <tr>
            <th className="text-center">{t('naming')}</th>
            <th className="text-center">{t('category_title')}</th>
            <th className="text-center">{t('products_code')}</th>
            <th className="text-center">{t('products_link')}</th>
            <th className="text-center">{t('products_price')}</th>
            <th style={{ width: '220px', textAlign: 'center' }} />
          </tr>
          </thead>
          <tbody>
          {LIST.length ? (
            <>
              {LIST.map(item => (
                <tr key={item.id}>
                  <td className="text-center">{item.title?.[lngCode]}</td>
                  <td className="text-center">{item.category?.title?.[lngCode]}</td>
                  <td className="text-center">{item.code}</td>
                  <td className="text-center">{item.link && <a href={item.link} target="_blank">{item.link}</a>}</td>
                  <td className="text-center">{formatNumberWithCommas(item.price)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {checkPermission(profile.data, rightsMapperData.productReadDetails) && (
                      <>
                        <Button type="button" className="text-center" color="primary" size="sm" onClick={editItem(item)}>
                          <FaMarker /> {t('edit')}
                        </Button>
                        &nbsp;&nbsp;
                      </>
                    )}
                    {checkPermission(profile.data, rightsMapperData.productDelete) && (
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
              <td colSpan={9} className="text-center">{t('data_not_found')}</td>
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
