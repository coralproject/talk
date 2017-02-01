import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);
import styles from './RestrictedContent.css';

export default ({canEditName}) => (
  <div className={styles.message}>
    <span>{
        canEditName ?
        lang.t('editNameMsg')
        : lang.t('bannedAccountMsg')
      }</span>
  </div>
);
