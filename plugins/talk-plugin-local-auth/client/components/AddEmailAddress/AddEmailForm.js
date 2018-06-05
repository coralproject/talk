import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddEmailForm.css';
import { Icon } from 'plugin-api/beta/client/components/ui';
import InputField from '../InputField';
import { t } from 'plugin-api/beta/client/services';
import {
  composeValidators,
  required,
  verifyEmail,
  confirmEmail,
  verifyPassword,
  confirmPassword,
} from 'coral-framework/lib/validation';
import { Form, Field } from 'react-final-form';

const AddEmailContent = ({ onSubmit }) => (
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
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, submitting }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Field
            name="email"
            validate={composeValidators(required, verifyEmail)}
          >
            {({ input, meta }) => (
              <InputField
                label={t(
                  'talk-plugin-local-auth.add_email.enter_email_address'
                )}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                errorMsg={meta.error}
                showError={meta.touched}
                columnDisplay
              />
            )}
          </Field>
          <Field name="confirmEmail" validate={confirmEmail('email')}>
            {({ input, meta }) => (
              <InputField
                label={t(
                  'talk-plugin-local-auth.add_email.confirm_email_address'
                )}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                errorMsg={meta.error}
                showError={meta.touched}
                columnDisplay
              />
            )}
          </Field>
          <Field
            name="password"
            validate={composeValidators(required, verifyPassword)}
          >
            {({ input, meta }) => (
              <InputField
                label={t('talk-plugin-local-auth.add_email.insert_password')}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                errorMsg={meta.error}
                showError={meta.touched}
                type="password"
                columnDisplay
              />
            )}
          </Field>
          <Field name="confirmPassword" validate={confirmPassword('password')}>
            {({ input, meta }) => (
              <InputField
                label={t('talk-plugin-local-auth.add_email.confirm_password')}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                errorMsg={meta.error}
                showError={meta.touched}
                type="password"
                columnDisplay
              />
            )}
          </Field>
          <div>
            <button className={styles.button} disabled={submitting}>
              {t('talk-plugin-local-auth.add_email.add_email_address')}
            </button>
          </div>
        </form>
      )}
    </Form>
  </div>
);

AddEmailContent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddEmailContent;
