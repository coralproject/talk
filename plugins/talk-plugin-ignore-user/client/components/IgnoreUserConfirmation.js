import React from 'react';
import styles from './IgnoreUserConfirmation.css';
import { t } from 'plugin-api/beta/client/services';
import cn from 'classnames';

export default ({ ignoreUser, cancel, username }) => (
  <aside className={cn(styles.root, 'talk-plugin-ignore-user-confirmation')}>
    <div className={styles.message}>
      <h1 className={styles.title}>
        {t('talk-plugin-ignore-user.confirmation_title', username)}
      </h1>
      {t('talk-plugin-ignore-user.confirmation')}
    </div>
    <div
      className={cn(
        styles.actions,
        'talk-plugin-ignore-user-confirmation-actions'
      )}
    >
      <button
        className={cn(
          styles.cancel,
          'talk-plugin-ignore-user-confirmation-cancel'
        )}
        onClick={cancel}
      >
        {t('talk-plugin-ignore-user.cancel')}
      </button>
      <button
        className={cn(
          styles.button,
          'talk-plugin-ignore-user-confirmation-button'
        )}
        onClick={ignoreUser}
      >
        {t('talk-plugin-ignore-user.ignore_user')}
      </button>
    </div>
  </aside>
);
