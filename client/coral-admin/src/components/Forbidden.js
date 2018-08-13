import React from 'react';
import styles from './Forbidden.css';
import t from 'coral-framework/services/i18n';

const Forbidden = () => (
  <div className={styles.container}>
    <p className={styles.copy}>{t('error.PAGE_NOT_AVAILABLE_ROLE')}</p>
  </div>
);

export default Forbidden;
