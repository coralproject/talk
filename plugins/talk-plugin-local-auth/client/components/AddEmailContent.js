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

    <form autoComplete="off" onSubmit={confirmChanges}>
      <InputField
        id="emailAddress"
        label={t('talk-plugin-local-auth.add_email.enter_email_address')}
        name="emailAddress"
        type="email"
        onChange={onChange}
        value={formData.emailAddress}
        hasError={!!errors.emailAddress}
        errorMsg={errors.emailAddress}
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
        value={formData.confirmEmailAddress}
        hasError={!!errors.confirmEmailAddress}
        errorMsg={errors.confirmEmailAddress}
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
        value={formData.confirmPassword}
        hasError={!!errors.confirmPassword}
        errorMsg={errors.confirmPassword}
        showError={showErrors}
        columnDisplay
        showSuccess={false}
      />
      <div className={styles.actions}>
        <button className={cn(styles.button, styles.proceed)}>
          {t('talk-plugin-local-auth.add_email.add_email_address')}
        </button>
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
