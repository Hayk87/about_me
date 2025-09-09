import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate, applicationBaseURL } from "../../utils";
import styles from './styles.module.scss';

const PageNotFound = () => {
    const { t } = useTranslate();
    return (
      <div className={styles.pageNotFound}>
        <h1>404: {t('page_not_found')}</h1>
        <Link to={`/${applicationBaseURL}/dashboard`}>{t('dashboard')}</Link>
      </div>
    );
}

export default PageNotFound;
