import React, { useEffect, useState } from "react";
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

export const path: string = `${webPagesPath.buyApp}/:categoryCode/details/:appCode`;

interface IStateData {
  isLoading: boolean;
  error: string;
  data: any;
}
const initialStateData = { isLoading: false, error: '', data: undefined };

const AppDetails = () => {
  const [stateData, setStateData] = useState<IStateData>(initialStateData);
  const params = useParams();
  const { t } = useTranslate();
  const { lngCode } = useLanguage();

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
      <>
        <h1>{title}</h1>
        {stateData.data.mainPhoto?.id && (
          <div>
            <img
              src={`${process.env.REACT_APP_UPLOADED_FILES_BASE_URL}/api/files/details/${stateData.data.mainPhoto?.id}`}
              alt={title}
              title={title}
              width={300}
            />
          </div>
        )}

        {stateData.data.files?.map((file: any) => (
          <div key={file.id}>
            <img
              src={`${process.env.REACT_APP_UPLOADED_FILES_BASE_URL}/api/files/details/${file.id}`}
              alt={stateData.data.category.title[lngCode]}
              title={stateData.data.category.title[lngCode]}
              width={300}
            />
          </div>
        ))}
        <div dangerouslySetInnerHTML={{ __html: stateData.data.content[lngCode] }} />
        <div>{t('products_price')} {formatNumberWithCommas(stateData.data.price)} $</div>
        {stateData.data.link && (
          <div>
            <a href={stateData.data.link} target="_blank" rel="noreferrer">{t('visit_to_app')}</a>
          </div>
        )}
        <div className="mt-4">
          {linkedinParams[0]}
          <a href={myLinkedinURL} target="_blank" rel="noreferrer">
          <span style={{ fontSize: 23 }}>
            <LinkedinIcon />
          </span>
          </a>
          {linkedinParams[1]}
          <span style={{ fontSize: 20 }}>&#128522;</span>
        </div>
      </>
    </WebLayout>
  );
}

export default AppDetails;
