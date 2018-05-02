import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddEmailAddressDialog.css';
import { Icon } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';
import InputField from './InputField';

const AddEmailContent = ({
  formData,
  errors,
  showErrors,
  confirmChanges,
  onChange,
}) => (
  <div>
    <h4 className={styles.title}>Add an Email Address</h4>
    <p className={styles.description}>
      For your added security, we require users to add an email address to their
      accounts. Your email address will be used to:
    </p>
    <ul className={styles.list}>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          Receive updates regarding any changes to your account (email address,
          username, password, etc.)
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          Allow you to download your comments.
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          Send comment notifications that you have chosen to receive.
        </span>
      </li>
    </ul>

    <form autoComplete="off">
      <InputField
        id="emailAddress"
        label="Enter Email Address:"
        name="emailAddress"
        type="email"
        onChange={onChange}
        defaultValue=""
        hasError={!formData.emailAddress || errors.emailAddress}
        errorMsg={'Invalid email address'}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <InputField
        id="confirmEmailAddress"
        label="Confirm Email Address:"
        name="confirmEmailAddress"
        type="email"
        onChange={onChange}
        defaultValue=""
        hasError={
          !formData.emailAddress ||
          formData.emailAddress !== formData.confirmEmailAddress
        }
        errorMsg={'Email address does not match'}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <InputField
        id="confirmPassword"
        label="Insert Password:"
        name="confirmPassword"
        type="password"
        onChange={onChange}
        defaultValue=""
        hasError={!formData.confirmPassword}
        errorMsg={'Confirm Password'}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <div className={styles.actions}>
        <a
          className={cn(styles.button, styles.proceed)}
          onClick={confirmChanges}
        >
          Add Email Address
        </a>
      </div>
    </form>
  </div>
);

AddEmailContent.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  showErrors: PropTypes.bool.isRequired,
  confirmChanges: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AddEmailContent;
