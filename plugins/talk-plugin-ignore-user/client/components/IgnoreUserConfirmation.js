import React from 'react';
import styles from './IgnoreUserConfirmation.css';
import {t} from 'plugin-api/beta/client/services';

export default ({ignoreUser, cancel, username}) => (
  <aside className={styles.root}>
    <div className={styles.message}>
      <h1 className={styles.title}>
        {t('talk-plugin-ignore-user.confirmation_title', username)}
      </h1>
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
  </aside>
);
