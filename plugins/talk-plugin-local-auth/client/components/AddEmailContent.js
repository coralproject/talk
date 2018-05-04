import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddEmailAddressDialog.css';
import { Icon } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';
import InputField from './InputField';
import { t } from 'plugin-api/beta/client/services';

const AddEmailContent = ({
  formData,
  errors,
  showErrors,
  confirmChanges,
  onChange,
}) => (
  <div>
    <h4 className={styles.title}>
      {t('talk-plugin-local-auth.add_email.content.title')}
    </h4>
    <p className={styles.description}>
      {t('talk-plugin-local-auth.add_email.content.description')}
    </p>
    <ul className={styles.list}>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          {t('talk-plugin-local-auth.add_email.content.item_1')}
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          {t('talk-plugin-local-auth.add_email.content.item_2')}
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          {t('talk-plugin-local-auth.add_email.content.item_3')}
        </span>
      </li>
    </ul>

    <form autoComplete="off">
      <InputField
        id="emailAddress"
        label={t('talk-plugin-local-auth.add_email.enter_email_address')}
        name="emailAddress"
        type="email"
        onChange={onChange}
        defaultValue=""
        hasError={!formData.emailAddress || errors.emailAddress}
        errorMsg={t('talk-plugin-local-auth.add_email.invalid_email_address')}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <InputField
        id="confirmEmailAddress"
        label={t('talk-plugin-local-auth.add_email.confirm_email_address')}
        name="confirmEmailAddress"
        type="email"
        onChange={onChange}
        defaultValue=""
        hasError={
          !formData.emailAddress ||
          formData.emailAddress !== formData.confirmEmailAddress
        }
        errorMsg={t('talk-plugin-local-auth.add_email.email_does_not_match')}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <InputField
        id="confirmPassword"
        label={t('talk-plugin-local-auth.add_email.insert_password')}
        name="confirmPassword"
        type="password"
        onChange={onChange}
        defaultValue=""
        hasError={!formData.confirmPassword}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <div className={styles.actions}>
        <a
          className={cn(styles.button, styles.proceed)}
          onClick={confirmChanges}
        >
          {t('talk-plugin-local-auth.add_email.add_email_address')}
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
