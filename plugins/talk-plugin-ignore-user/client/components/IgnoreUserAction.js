import React from 'react';
import styles from './IgnoreUserAction.css';
import {t} from 'plugin-api/beta/client/services';

export default ({ignoreUser}) => (
  <button className={styles.button} onClick={ignoreUser}>
    {t('talk-plugin-ignore-user.ignore')}
  </button>
);
