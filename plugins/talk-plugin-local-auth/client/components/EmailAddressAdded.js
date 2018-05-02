import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './AddEmailAddressDialog.css';

const EmailAddressAdded = ({ done }) => (
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
    <div className={styles.actions}>
      <a className={cn(styles.button, styles.proceed)} onClick={done}>
        Done
      </a>
    </div>
  </div>
);

EmailAddressAdded.propTypes = {
  done: PropTypes.func.isRequired,
};

export default EmailAddressAdded;
