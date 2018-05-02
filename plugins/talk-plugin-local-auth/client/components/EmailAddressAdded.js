import React from 'react';
import styles from './AddEmailAddressDialog.css';

const EmailAddressAdded = () => (
  <div>
    <h4 className={styles.title}>Email Address Added</h4>
    <p className={styles.description}>
      Your email address has been added to your account.
    </p>
    <strong>Need to change your email address?</strong>
    <p className={styles.description}>
      You can change your account settings by visiting{' '}
      <strong>My Profile {'>'} Settings</strong>.
    </p>
  </div>
);

export default EmailAddressAdded;
