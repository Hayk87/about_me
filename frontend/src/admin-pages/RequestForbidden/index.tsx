import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate, applicationBaseURL, adminPagesPath } from "../../utils";
import styles from './styles.module.scss';

const RequestForbidden = () => {
    const { t } = useTranslate();
    return (
      <div className={styles.pageForbidden}>
        <h1>403: {t('forbidden_request')}</h1>
        <Link to={`/${applicationBaseURL}/${adminPagesPath.dashboard}`}>{t('dashboard')}</Link>
      </div>
    );
}

export default RequestForbidden;
