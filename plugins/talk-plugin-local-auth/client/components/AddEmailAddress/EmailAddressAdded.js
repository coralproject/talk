import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmailAddressAdded.css';
import { t } from 'plugin-api/beta/client/services';

const EmailAddressAdded = ({ onDone }) => (
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
    <div>
      <button className={styles.button} onClick={onDone}>
        {t('talk-plugin-local-auth.add_email.done')}
      </button>
    </div>
  </div>
);

EmailAddressAdded.propTypes = {
  onDone: PropTypes.func.isRequired,
};

export default EmailAddressAdded;
