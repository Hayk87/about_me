import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from "../../utils";
import styles from './styles.module.scss';
import WebLayout from "../../Layouts/WebLayout";

interface IPageNotFound {
  code?: string;
}

const PageNotFound = (props: IPageNotFound) => {
    const { t } = useTranslate();
    return (
      <WebLayout>
          <div className={styles.pageNotFound}>
              <h1>404: {t(props.code || 'page_not_found')}</h1>
              <Link to={`/`}>{t('home')}</Link>
          </div>
      </WebLayout>
    );
}

export default PageNotFound;
