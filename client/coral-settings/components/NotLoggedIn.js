import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './NotLoggedIn.css';
import t from 'coral-framework/services/i18n';

const NotLoggedIn = ({showSignInDialog}) => (
  <div className={cn(styles.message, 'talk-not-logged-in-message')}>
    <div>
      <a onClick={showSignInDialog}>{t('settings.sign_in')}</a> {t('settings.to_access')}
    </div>
    <div>
      {t('from_settings_page')}
    </div>
  </div>
);

NotLoggedIn.propTypes = {
  showSignInDialog: PropTypes.func,
};

export default NotLoggedIn;
