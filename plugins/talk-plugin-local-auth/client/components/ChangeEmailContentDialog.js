import React from 'react';
import PropTypes from 'prop-types';
import styles from './ChangeEmailContentDialog.css';
import InputField from './InputField';
import { Button } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

const initialState = {
  showError: false,
  formData: {
    confirmPassword: '',
  },
  errors: {},
};

class ChangeEmailContentDialog extends React.Component {
  state = initialState;

  clearForm = () => {
    this.setState(initialState);
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

  onChange = e => {
    const { name, value, type, dataset } = e.target;
    const validationType = dataset.validationType || type;

    this.setState(
      state => ({
        formData: {
          ...state.formData,
          [name]: value,
        },
      }),
      () => {
        this.fieldValidation(value, validationType, name);
      }
    );
  };

  hasError = err => {
    return Object.keys(this.state.errors).indexOf(err) !== -1;
  };

  getError = errorKey => {
    return this.state.errors[errorKey];
  };

  showError = () => {
    this.setState({
      showError: true,
    });
  };

  cancel = () => {
    this.clearForm();
    this.props.closeDialog();
  };

  confirmChanges = async e => {
    e.preventDefault();

    const { confirmPassword = '' } = this.state.formData;

    if (this.formHasError()) {
      this.showError();
      return;
    }

    await this.props.save(confirmPassword);
    this.props.next();
  };

  formHasError = () => this.hasError('confirmPassword');

  render() {
    return (
      <div>
        <span className={styles.close} onClick={this.cancel}>
          ×
        </span>
        <h1 className={styles.title}>
          {t('talk-plugin-local-auth.change_email.confirm_email_change')}
        </h1>
        <div className={styles.content}>
          <p className={styles.description}>
            {t('talk-plugin-local-auth.change_email.description')}
          </p>
          <div className={styles.emailChange}>
            <span className={styles.item}>
              {t('talk-plugin-local-auth.change_email.old_email')}:{' '}
              {this.props.email}
            </span>
            <span className={styles.item}>
              {t('talk-plugin-local-auth.change_email.new_email')}:{' '}
              {this.props.formData.newEmail}
            </span>
          </div>
          <form onSubmit={this.confirmChanges}>
            <InputField
              id="confirmPassword"
              label={t('talk-plugin-local-auth.change_email.enter_password')}
              name="confirmPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.confirmPassword}
              hasError={this.hasError('confirmPassword')}
              errorMsg={this.getError('confirmPassword')}
              showError={this.state.showError}
              columnDisplay
            />
            <div className={styles.bottomActions}>
              <Button
                className={styles.cancel}
                onClick={this.cancel}
                type="button"
              >
                {t('talk-plugin-local-auth.change_email.cancel')}
              </Button>
              <Button className={styles.confirmChanges} type="submit">
                {t('talk-plugin-local-auth.change_email.confirm_change')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ChangeEmailContentDialog.propTypes = {
  next: PropTypes.func,
  save: PropTypes.func,
  formData: PropTypes.object,
  email: PropTypes.string,
  closeDialog: PropTypes.func,
};

export default ChangeEmailContentDialog;
