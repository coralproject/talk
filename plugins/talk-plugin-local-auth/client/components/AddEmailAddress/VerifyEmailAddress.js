import React from 'react';
import PropTypes from 'prop-types';
import styles from './VerifyEmailAddress.css';
import { t } from 'plugin-api/beta/client/services';

const VerifyEmailAddress = ({ emailAddress, onDone }) => (
  <div>
    <h4 className={styles.title}>
      {t('talk-plugin-local-auth.add_email.verify.title')}
    </h4>
    <p className={styles.description}>
      {t('talk-plugin-local-auth.add_email.verify.description', emailAddress)}
    </p>
    <div>
      <button className={styles.button} onClick={onDone}>
        {t('talk-plugin-local-auth.add_email.done')}
      </button>
    </div>
  </div>
);

VerifyEmailAddress.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default VerifyEmailAddress;
