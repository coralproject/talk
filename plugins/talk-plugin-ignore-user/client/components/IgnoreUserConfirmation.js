import React from 'react';
import styles from './IgnoreUserConfirmation.css';
import {t} from 'plugin-api/beta/client/services';

export default ({ignoreUser, cancel}) => (
  <div className={styles.root}>
    <div className={styles.message}>
      {t('talk-plugin-ignore-user.confirmation')}
    </div>
    <div className={styles.actions}>
      <button className={styles.cancel} onClick={cancel}>
        {t('talk-plugin-ignore-user.cancel')}
      </button>
      <button className={styles.button} onClick={ignoreUser}>
        {t('talk-plugin-ignore-user.ignore_user')}
      </button>
    </div>
  </div>
);
