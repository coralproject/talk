import React from 'react';
import styles from './NotLoggedIn.css';

import t from 'coral-framework/services/i18n';

export default ({showSignInDialog}) => (
  <div className={styles.message}>
    <div>
      <a onClick={showSignInDialog}>{t('sign_in')}</a> {t('toAccess')}
    </div>
    <div>
      {t('from_settings_page')}
    </div>
  </div>
);
