import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserBox.css';
import { t } from 'plugin-api/beta/client/services';
import cn from 'classnames';

const UserBox = ({ username, logout, onShowProfile }) => (
  <div>
    {username ? (
      <div className={cn(styles.userBox, 'talk-stream-auth-userbox')}>
        <span className={styles.userBoxLoggedIn}>
          {t('talk-plugin-auth.login.logged_in_as')}
        </span>
        <a onClick={onShowProfile}>{username}</a>.{' '}
        {t('talk-plugin-auth.login.not_you')}
        <a
          className={cn(styles.logout, 'talk-stream-userbox-logout')}
          onClick={() => logout()}
        >
          {t('talk-plugin-auth.login.logout')}
        </a>
      </div>
    ) : null}
  </div>
);

UserBox.propTypes = {
  username: PropTypes.string,
  logout: PropTypes.func,
  onShowProfile: PropTypes.func,
};

export default UserBox;
