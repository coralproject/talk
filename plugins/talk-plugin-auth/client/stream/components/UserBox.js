import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserBox.css';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';

const UserBox = ({ user, logout, onShowProfile }) => (
  <div>
    {user ? (
      <div className={cn(styles.userBox, 'talk-stream-auth-userbox')}>
        <span className={styles.userBoxLoggedIn}>
          {t('sign_in.logged_in_as')}
        </span>
        <a onClick={onShowProfile}>{user.username}</a>. {t('sign_in.not_you')}
        <a
          className={cn(styles.logout, 'talk-stream-userbox-logout')}
          onClick={() => logout()}
        >
          {t('sign_in.logout')}
        </a>
      </div>
    ) : null}
  </div>
);

UserBox.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
  onShowProfile: PropTypes.func,
};

export default UserBox;
