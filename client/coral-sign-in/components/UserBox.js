import React from 'react';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const UserBox = ({ className, user, logout, changeTab }) => (
  <div className={`${styles.userBox} ${className ? className : ''}`}>
    {lang.t('signIn.loggedInAs')}
    <a onClick={() => changeTab(1)}>{user.username}</a>. {lang.t('signIn.notYou')}
    <a className={styles.logout} onClick={logout} id='logout'>{lang.t('signIn.logout')}</a>
  </div>
);

export default UserBox;
