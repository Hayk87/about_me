import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { FaFilter, FaEye } from 'react-icons/fa6';
import queryString from "query-string";
import { rightsMapperData, useTranslate, applicationBaseURL, checkPermission, adminPagesPath } from '../../utils';
import { getOfferList } from "../../api/requests";
import { RootState } from "../../store";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import SearchForm from "../../components/SearchForm";
import { initListAndCount } from "../../store/slices/offer";
import { useToast } from "../../hooks";
import styles from "./styles.module.scss";

export const path: string = adminPagesPath.offers;
export const viewPagePermission: string = rightsMapperData.offerRead;

const itemsPerPage = 10;
const pagesSize = 5;

const fields = [
  { type: 'text', tr_key: 'naming', key: 'name' },
  { type: 'text', tr_key: 'email', key: 'email' },
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { alertError, alertSuccess } = useToast();
  const languages = useSelector((state: RootState) => state.languages);
  const rows = useSelector((state: RootState) => state.offers);
  const profile = useSelector((state: RootState) => state.profile);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;
  const { t } = useTranslate();
  const pages = useMemo(() => Math.ceil(rows.count / itemsPerPage), [rows.count]);
  const page = useMemo(() => parseInt((parsed.page as string)) || 1, [parsed.page]);

  const LIST = useMemo(() => rows.list, [rows.list]);

  const toggleFilterOpen = useCallback(() => setFilterOpen(prev => !prev), []);

  const editItem = (item: any) => () => {
    const searchStr = queryString.stringify(parsed);
    navigate(`/${applicationBaseURL}/${adminPagesPath.offerDetailsId.replace(':id', item.offer_id)}${searchStr ? `?${searchStr}` : ''}`);
  }

  const fetchData = (loc: string) => {
    setLoading(true);
    const parsed = queryString.parse(loc);
    const lang = parsed.lng || languages.list.find(item => item.is_default)?.code;
    const search: any = { lang, page: (parsed.page as string) || 1, limit: itemsPerPage };
    if (parsed.name) {
      search.name = parsed.name as string;
    }
    if (parsed.email) {
      search.email = parsed.email as string;
    }
    getOfferList(search)
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
    return () => {
      dispatch(initListAndCount({ list: [], count: 0 }));
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <h1>{t('offers')}</h1>
        <div className={styles.btns}>
          <Button type="button" color="info" size="sm" onClick={toggleFilterOpen}>
            <FaFilter /> {t('filter')}
          </Button>
        </div>
        <SearchForm visible={filterOpen} fields={fields} />
        <Table bordered striped>
          <thead>
          <tr>
            <th className="text-center">{t('naming')}</th>
            <th className="text-center">{t('email')}</th>
            <th style={{ width: '220px', textAlign: 'center' }} />
          </tr>
          </thead>
          <tbody>
          {LIST.length ? (
            <>
              {LIST.map(item => (
                <tr key={item.offer_id}>
                  <td className="text-center">{item.offer_name}</td>
                  <td className="text-center">{item.offer_email}</td>
                  <td style={{ textAlign: 'center' }}>
                    {checkPermission(profile.data, rightsMapperData.offerReadDetails) && (
                      <>
                        <Button type="button" className="text-center" color="primary" size="sm" onClick={editItem(item)}>
                          <FaEye /> {t('view')}
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
              <td colSpan={3} className="text-center">{t('data_not_found')}</td>
            </tr>
          )}
          </tbody>
        </Table>
        <div className={styles.paginationContainer}>
          <Pagination pages={pages} page={page} pagesSize={pagesSize} goTo={goToPage} />
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

