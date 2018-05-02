import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './AddEmailAddressDialog.css';

const VerifyEmailAddress = ({ emailAddress, done }) => (
  <div>
    <h4 className={styles.title}>Verify Your Email Address</h4>
    <p className={styles.description}>
      We’ve sent an email to {emailAddress} to verify your account. You must
      verify your email address so that it can be used for account change
      confirmations and notifications.
    </p>
    <div className={styles.actions}>
      <a className={cn(styles.button, styles.proceed)} onClick={done}>
        Done
      </a>
    </div>
  </div>
);

VerifyEmailAddress.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  done: PropTypes.func.isRequired,
};

export default VerifyEmailAddress;
