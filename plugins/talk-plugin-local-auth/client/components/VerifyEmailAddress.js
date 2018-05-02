import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddEmailAddressDialog.css';

const VerifyEmailAddress = ({ emailAddress }) => (
  <div>
    <h4 className={styles.title}>Verify Your Email Address</h4>
    <p className={styles.description}>
      We’ve sent an email to {emailAddress} to verify your account. You must
      verify your email address so that it can be used for account change
      confirmations and notifications.
    </p>
  </div>
);

VerifyEmailAddress.propTypes = {
  emailAddress: PropTypes.string,
};

export default VerifyEmailAddress;
