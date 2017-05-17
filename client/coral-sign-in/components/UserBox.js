import React from 'react';
import styles from './styles.css';
import t from 'coral-i18n/services/i18n';

const UserBox = ({className, user, onLogout, onShowProfile}) => (
  <div className={`${styles.userBox} ${className ? className : ''}`}>
    {t('sign_in.logged_in_as')}
    <a onClick={onShowProfile}>{user.username}</a>. {t('sign_in.not_you')}
    <a className={styles.logout} onClick={onLogout} id='logout'>{t('sign_in.logout')}</a>
  </div>
);

export default UserBox;
