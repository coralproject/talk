import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './ChangePassword.css';
import { Button, BareButton } from 'plugin-api/beta/client/components/ui';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import isEqual from 'lodash/isEqual';
import { t } from 'plugin-api/beta/client/services';
import InputField from './InputField';
import { getErrorMessages } from 'coral-framework/utils';

const initialState = {
  editing: false,
  showErrors: true,
  errors: {},
  formData: {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  },
};

class ChangePassword extends React.Component {
  state = initialState;
  validKeys = ['oldPassword', 'newPassword', 'confirmNewPassword'];

  onChange = e => {
    const { name, value, type } = e.target;
    this.setState(
      state => ({
        formData: {
          ...state.formData,
          [name]: value,
        },
      }),
      () => {
        this.fieldValidation(value, type, name);

        // Perform equality validation if password fields have changed
        if (name === 'newPassword' || name === 'confirmNewPassword') {
          this.equalityValidation('newPassword', 'confirmNewPassword');
        }
      }
    );
  };

  equalityValidation = (field, field2) => {
    const cond = this.state.formData[field] === this.state.formData[field2];
    if (!cond) {
      this.addError({
        [field2]: t(
          'talk-plugin-local-auth.change_password.passwords_dont_match'
        ),
      });
    } else {
      this.removeError(field2);
    }
    return cond;
  };

  fieldValidation = (value, type, name) => {
    if (!value.length) {
      this.addError({
        [name]: t('talk-plugin-local-auth.change_password.required_field'),
      });
    } else if (!validate[type](value)) {
      this.addError({ [name]: errorMsj[type] });
    } else {
      this.removeError(name);
    }
  };

  hasError = err => {
    return Object.keys(this.state.errors).indexOf(err) !== -1;
  };

  addError = err => {
    this.setState(({ errors }) => ({
      errors: { ...errors, ...err },
    }));
  };

  removeError = errKey => {
    this.setState(state => {
      const { [errKey]: _, ...errors } = state.errors;
      return {
        errors,
      };
    });
  };

  enableEditing = () => {
    this.setState({
      editing: true,
    });
  };

  isSubmitBlocked = () => {
    const formHasErrors = !!Object.keys(this.state.errors).length;
    const formIncomplete = !isEqual(
      Object.keys(this.state.formData),
      this.validKeys
    );
    return formHasErrors || formIncomplete;
  };

  clearForm = () => {
    this.setState(initialState);
  };

  onSave = async e => {
    e.preventDefault();

    if (this.isSubmitBlocked()) {
      return;
    }

    const { oldPassword, newPassword } = this.state.formData;

    try {
      await this.props.changePassword({
        oldPassword,
        newPassword,
      });
      this.props.notify(
        'success',
        t('talk-plugin-local-auth.change_password.changed_password_msg')
      );
      this.clearForm();
      this.disableEditing();
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  onForgotPassword = async () => {
    const {
      root: {
        me: { email },
      },
    } = this.props;

    try {
      await this.props.forgotPassword(email);
      this.props.notify(
        'success',
        t('talk-plugin-local-auth.change_password.forgot_password_sent')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }

    this.clearForm();
    this.disableEditing();
  };

  disableEditing = () => {
    this.setState({
      editing: false,
    });
  };

  cancel = () => {
    this.clearForm();
    this.disableEditing();
  };

  render() {
    const { editing, errors, showErrors } = this.state;

    return (
      <section
        className={cn(
          'talk-plugin-local-auth--change-password',
          styles.container,
          {
            [styles.editing]: editing,
          }
        )}
      >
        <h3 className={styles.title}>
          {t('talk-plugin-local-auth.change_password.change_password')}
        </h3>
        {editing ? (
          <form
            className="talk-plugin-local-auth--change-password-form"
            onSubmit={this.onSave}
          >
            <InputField
              id="oldPassword"
              label={t('talk-plugin-local-auth.change_password.old_password')}
              name="oldPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.oldPassword}
              hasError={this.hasError('oldPassword')}
              errorMsg={errors['oldPassword']}
              showError={showErrors}
            >
              <span className={styles.detailBottomBox}>
                <a
                  className={styles.detailLink}
                  onClick={this.onForgotPassword}
                >
                  {t('talk-plugin-local-auth.change_password.forgot_password')}
                </a>
              </span>
            </InputField>
            <InputField
              id="newPassword"
              label={t('talk-plugin-local-auth.change_password.new_password')}
              name="newPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.newPassword}
              hasError={this.hasError('newPassword')}
              errorMsg={errors['newPassword']}
              showError={showErrors}
            />
            <InputField
              id="confirmNewPassword"
              label={t(
                'talk-plugin-local-auth.change_password.confirm_new_password'
              )}
              name="confirmNewPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.confirmNewPassword}
              hasError={this.hasError('confirmNewPassword')}
              errorMsg={errors['confirmNewPassword']}
              showError={showErrors}
            />
            <div className={styles.actions}>
              <Button
                className={cn(styles.button, styles.saveButton)}
                icon="save"
                type="submit"
                disabled={this.isSubmitBlocked()}
              >
                {t('talk-plugin-local-auth.change_password.save')}
              </Button>
              <BareButton
                type="button"
                className={styles.cancelButton}
                onClick={this.cancel}
              >
                {t('talk-plugin-local-auth.change_password.cancel')}
              </BareButton>
            </div>
          </form>
        ) : (
          <div className={styles.actions}>
            <Button className={styles.button} onClick={this.enableEditing}>
              {t('talk-plugin-local-auth.change_password.edit')}
            </Button>
          </div>
        )}
      </section>
    );
  }
}

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

export default ChangePassword;
