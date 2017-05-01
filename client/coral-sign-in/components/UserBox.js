import React from 'react';
import styles from './styles.css';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const UserBox = ({className, user, onLogout, onShowProfile}) => (
  <div className={`${styles.userBox} ${className ? className : ''}`}>
    {lang.t('signIn.loggedInAs')}
    <a onClick={onShowProfile}>{user.username}</a>. {lang.t('signIn.notYou')}
    <a className={styles.logout} onClick={onLogout} id='logout'>{lang.t('signIn.logout')}</a>
  </div>
);

export default UserBox;
