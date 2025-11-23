import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import WebLayout from "../../Layouts/WebLayout";
import PageNotFound from "../PageNotFound";
import Loading from "../../components/Loading";
import OfferForm from "../../components/OfferForm";
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
  const navigate = useNavigate();
  const params = useParams();
  const [stateData, setStateData] = useState<IStateData>(initialStateData);
  const [showForm, setShowForm] = useState<boolean>(false);

  const notFoundAppMsgParams = useMemo(() => t('you_not_found_your_app').split('<TAG>'), [lngCode, t]);

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
            <Card
              key={product.code}
              className={styles.product}
            >
              <img
                alt={product.title[lngCode]}
                title={product.title[lngCode]}
                src={`${process.env.REACT_APP_UPLOADED_FILES_BASE_URL}/api/files/details/${product.mainPhoto?.id}`}
              />
              <CardBody>
                <CardTitle tag="h5">
                  {product.title[lngCode]}
                </CardTitle>
                <CardText>
                  {product.short_content?.[lngCode]}
                </CardText>
                <Button
                  type="button"
                  className={styles.viewMore}
                  onClick={() => navigate(`${location.pathname}/details/${product.code}`)}
                  color={'info'}
                  outline
                >
                  {t('view_more')}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="mt-5">
          {showForm ? (
            <>
              <div>{t('have_some_offer')}</div>
              <OfferForm />
            </>
          ) : (
            <div>
              {notFoundAppMsgParams[0]}
              <span className={styles.here} onClick={() => setShowForm(true)}>{notFoundAppMsgParams[1]}</span>
              {notFoundAppMsgParams[2]}
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
}

export default AppCategoryList;
