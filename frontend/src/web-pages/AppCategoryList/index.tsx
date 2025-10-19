import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import WebLayout from "../../Layouts/WebLayout";
import PageNotFound from "../PageNotFound";
import Loading from "../../components/Loading";
import { useLanguage, useTranslate, webPagesPath } from "../../utils";
import { getProductsListByCategoryCode } from "../../api/requests";
import styles from "./styles.module.scss";

export const path: string = `${webPagesPath.buyApp}/:code`;

interface IStateData {
  isLoading: boolean;
  error: string;
  data: any;
}
const initialStateData = { isLoading: false, error: '', data: null };

const AppCategoryList = () => {
  const { t } = useTranslate();
  const { lngCode, location } = useLanguage();
  const params = useParams();
  const [stateData, setStateData] = useState<IStateData>(initialStateData);

  useEffect(() => {
    setStateData(prev => ({ ...prev, isLoading: true, error: '' }));
    getProductsListByCategoryCode(params.code!)
      .then((res) => {
        setStateData(prev => ({ ...prev, data: res.data, isLoading: false }));
      })
      .catch(err => {
        setStateData(prev => ({ ...prev, error: err.response.data.message, isLoading: false }));
      });
  }, [params.code]);

  if (stateData.isLoading) return <Loading />;

  if (stateData.error) {
    return <PageNotFound code={stateData.error} />
  }

  return (
    <WebLayout>
      <div className={styles.Main}>
        <h1 className={styles.categoryName}>{stateData.data?.title?.[lngCode]}</h1>
        <div className={styles.products}>
          {stateData.data?.products.map((product: any) => (
            <div key={product.code} className={styles.product}>
              <div className="title">{product.title[lngCode]}</div>
              <img
                src={`${process.env.REACT_APP_UPLOADED_FILES_BASE_URL}/api/files/details/${product.mainPhoto.id}`}
                alt={product.title?.[lngCode]}
                title={product.title?.[lngCode]}
              />
              <div dangerouslySetInnerHTML={{ __html: product.content[lngCode] }} />
              <div className={styles.viewMore}>
                <Link to={`${location.pathname}/details/${product.code}`}>{t('view_more')}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WebLayout>
  );
}

export default AppCategoryList;
