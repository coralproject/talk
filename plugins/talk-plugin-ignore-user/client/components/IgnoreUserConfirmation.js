import React from 'react';
import styles from './IgnoreUserConfirmation.css';
import {t} from 'plugin-api/beta/client/services';

export default ({ignoreUser}) => (
  <div className={styles.root}>
    Do you really want to ignore this user?
    <div className={styles.actions}>
      <button className={styles.button} onClick={ignoreUser}>
        {t('talk-plugin-ignore-user.ignore')}
      </button>
    </div>
  </div>
);
