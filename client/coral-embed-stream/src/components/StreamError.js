import React from 'react';
import styles from './StreamError.css';
import t from 'coral-framework/services/i18n';

export const StreamError = () => (
  <div className={styles.streamError}>
    {t('common.error')}
  </div>
);
