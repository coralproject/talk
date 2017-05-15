import React from 'react';
import styles from './styles.css';
import I18n from 'coral-i18n/modules/i18n/i18n';

const lang = new I18n();

const UserBox = ({className, user, onLogout, onShowProfile}) => (
  <div className={`${styles.userBox} ${className ? className : ''}`}>
    {lang.t('sign_in.logged_in_as')}
    <a onClick={onShowProfile}>{user.username}</a>. {lang.t('sign_in.not_you')}
    <a className={styles.logout} onClick={onLogout} id='logout'>{lang.t('sign_in.logout')}</a>
  </div>
);

export default UserBox;
