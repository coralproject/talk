import React from 'react';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const UserBox = ({className, user, logout, ...props}) => (
  <div
    className={`${styles.userBox} ${className ? className : ''}`}
    {...props}
  >
    {lang.t('signIn.loggedInAs')} <a>{user.displayName}</a>. {lang.t('signIn.notYou')} <a onClick={logout}>{lang.t('signIn.logout')}</a>
  </div>
);

export default UserBox;
