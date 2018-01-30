import React from 'react';
import styles from './NotLoggedIn.css';
import cn from 'classnames';

import t from 'coral-framework/services/i18n';

export default ({ showSignInDialog }) => (
  <div className={cn(styles.message, 'talk-embed-stream-not-logged-in')}>
    <div>
      <a onClick={showSignInDialog}>{t('settings.sign_in')}</a>{' '}
      {t('settings.to_access')}
    </div>
    <div>{t('from_settings_page')}</div>
  </div>
);
