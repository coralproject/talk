import React from 'react';
import styles from './IgnoreUserAction.css';
import { t } from 'plugin-api/beta/client/services';
import cn from 'classnames';

export default ({ ignoreUser }) => (
  <button
    className={cn(styles.button, 'talk-plugin-ignore-user-action')}
    onClick={ignoreUser}
  >
    {t('talk-plugin-ignore-user.ignore_user')}
  </button>
);
