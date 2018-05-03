import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './AddEmailAddressDialog.css';
import { t } from 'plugin-api/beta/client/services';

const EmailAddressAdded = ({ done }) => (
  <div>
    <h4 className={styles.title}>
      {t('talk-plugin-local-auth.add_email.added.title')}
    </h4>
    <p className={styles.description}>
      {t('talk-plugin-local-auth.add_email.added.description')}
    </p>
    <strong>{t('talk-plugin-local-auth.add_email.added.subtitle')}</strong>
    <p className={styles.description}>
      {t('talk-plugin-local-auth.add_email.added.description_2')}{' '}
      <strong>{t('talk-plugin-local-auth.add_email.added.path')}</strong>.
    </p>
    <div className={styles.actions}>
      <a className={cn(styles.button, styles.proceed)} onClick={done}>
        {t('talk-plugin-local-auth.add_email.done')}
      </a>
    </div>
  </div>
);

EmailAddressAdded.propTypes = {
  done: PropTypes.func.isRequired,
};

export default EmailAddressAdded;
