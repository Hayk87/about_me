import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { useParams } from "react-router-dom";
import WebLayout from "../../Layouts/WebLayout";
import {
  formatNumberWithCommas,
  useLanguage,
  useTranslate,
  webPagesPath,
  myLinkedinURL
} from "../../utils";
import { getProductByCategoryCodeAndProductCode } from "../../api/requests";
import Loading from "../../components/Loading";
import PageNotFound from "../PageNotFound";
import { LinkedinIcon } from "../../components/Icons";
import styles from "./styles.module.scss";

export const path: string = `${webPagesPath.buyApp}/:categoryCode/details/:appCode`;

interface IStateData {
  isLoading: boolean;
  error: string;
  data: any;
}
const initialStateData = { isLoading: false, error: '', data: undefined };

const AppDetails = () => {
  const [stateData, setStateData] = useState<IStateData>(initialStateData);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const params = useParams();
  const { t } = useTranslate();
  const { lngCode } = useLanguage();

  const showImage = (source: string) => () => {
    setSelectedImage(source);
  }

  useEffect(() => {
    setStateData(prev => ({ ...prev, isLoading: true, error: '' }));
    getProductByCategoryCodeAndProductCode(params.categoryCode!, params.appCode!)
      .then((res) => {
        setStateData(prev => ({ ...prev, data: res.data, isLoading: false }));
      })
      .catch(err => {
        setStateData(prev => ({ ...prev, error: err.response.data.message, isLoading: false, data: null }));
      });
  }, [params.categoryCode, params.appCode]);

  if (stateData.isLoading || stateData.data === undefined) return <Loading />;

  if (stateData.error) {
    return <PageNotFound code={stateData.error} />
  }

  const linkedinParams = t('connect_with_me_linkedin').split('[[LINKEDIN_LINK]]');
  const title = `${stateData.data.category.title[lngCode]} / ${stateData.data.title[lngCode]}`;

  return (
    <WebLayout>
      <div className={styles.AppDetails}>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: stateData.data.content[lngCode] }} />
        <div className={styles.AppFiles}>
          {stateData.data.files?.map((file: any) => {
            const sourcePath = `${process.env.REACT_APP_UPLOADED_FILES_BASE_URL}/api/files/details/${file.id}`;
            return (
              <div key={file.id} className={styles.AppFileItem}>
                <img
                  src={sourcePath}
                  alt={stateData.data.category.title[lngCode]}
                  title={stateData.data.category.title[lngCode]}
                  width={300}
                  onClick={showImage(sourcePath)}
                />
              </div>
            );
          })}
        </div>
        <div className={styles.products_price}>
          {t('products_price')} {stateData.data.price ? formatNumberWithCommas(stateData.data.price) + ' $' : t('contract_price')}
        </div>
        {stateData.data.link && (
          <div className={styles.products_link}>
            <a href={stateData.data.link} target="_blank" rel="noreferrer">{t('visit_to_app')}</a>
          </div>
        )}
        <div className={styles.contact_with_me}>
          {linkedinParams[0]}
          <a href={myLinkedinURL} target="_blank" rel="noreferrer">
          <span style={{ fontSize: 23 }}>
            <LinkedinIcon />
          </span>
          </a>
          {linkedinParams[1]}
          <span style={{ fontSize: 20 }}>&#128522;</span>
        </div>
        {selectedImage && (
          ReactDOM.createPortal(
            <div className={styles.showImage} onClick={() => setSelectedImage('')}>
              <img src={selectedImage} onClick={(e) => e.stopPropagation()} />
            </div>,
            document.body
          )
        )}
      </div>
    </WebLayout>
  );
}

export default AppDetails;
