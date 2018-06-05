import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import validate from 'coral-framework/helpers/validate';
import { getErrorMessages } from 'coral-framework/utils';
import styles from './AddEmailAddressDialog.css';
import { t } from 'plugin-api/beta/client/services';

import AddEmailContent from './AddEmailContent';
import VerifyEmailAddress from './VerifyEmailAddress';
import EmailAddressAdded from './EmailAddressAdded';

const initialState = {
  step: 0,
  showErrors: false,
  errors: {},
  formData: {
    emailAddress: '',
    confirmPassword: '',
    confirmEmailAddress: '',
  },
};

const validateRequired = v =>
  v ? '' : t('talk-plugin-local-auth.add_email.required_field');

const validateRepeat = (key, msg) => (v, data) => (v !== data[key] ? msg : '');

const validateEmail = v =>
  validateRequired(v) || !validate.email(v)
    ? t('talk-plugin-local-auth.add_email.invalid_email_address')
    : '';

const validatePassword = v => validateRequired(v);

class AddEmailAddressDialog extends React.Component {
  state = initialState;

  fields = {
    emailAddress: validateEmail,
    confirmPassword: validatePassword,
    confirmEmailAddress: validateRepeat(
      'emailAddress',
      t('talk-plugin-local-auth.add_email.confirm_email_address')
    ),
  };

  componentDidMount() {
    this.props.startAttach();
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState(
      state => ({
        formData: {
          ...state.formData,
          [name]: value,
        },
      }),
      () => {
        this.validate();
      }
    );
  };

  validateField = (value, name) => {
    const error = this.fields[name](value, this.state.formData);
    if (error) {
      this.addError({ [name]: error });
      return false;
    }
    this.removeError(name);
    return true;
  };

  addError = err => {
    this.setState(({ errors }) => ({
      errors: { ...errors, ...err },
    }));
  };

  validate() {
    let hasErrors = false;
    Object.keys(this.state.formData).forEach(k => {
      hasErrors = !this.validateField(this.state.formData[k], k) || hasErrors;
    });
    return !hasErrors;
  }

  removeError = errKey => {
    this.setState(state => {
      const { [errKey]: _, ...errors } = state.errors;
      return {
        errors,
      };
    });
  };

  showErrors = () => {
    this.setState({
      showErrors: true,
    });
  };

  finish = () => {
    this.props.finishAttach();
  };

  confirmChanges = async e => {
    e.preventDefault();

    if (!this.validate()) {
      this.showErrors();
      return;
    }

    const { emailAddress, confirmPassword } = this.state.formData;
    const { attachLocalAuth } = this.props;

    try {
      await attachLocalAuth({
        email: emailAddress,
        password: confirmPassword,
      });

      this.props.notify(
        'success',
        t('talk-plugin-local-auth.add_email.added.alert')
      );
      this.goToNextStep();
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  goToNextStep = () => {
    this.setState(({ step }) => ({
      step: step + 1,
    }));
  };

  render() {
    const { errors, formData, showErrors, step } = this.state;
    const {
      root: { settings },
    } = this.props;

    return (
      <Dialog className={styles.dialog} open={true}>
        {step === 0 && (
          <AddEmailContent
            formData={formData}
            errors={errors}
            showErrors={showErrors}
            confirmChanges={this.confirmChanges}
            onChange={this.onChange}
          />
        )}
        {step === 1 &&
          !settings.requireEmailConfirmation && (
            <EmailAddressAdded done={this.finish} />
          )}
        {step === 1 &&
          settings.requireEmailConfirmation && (
            <VerifyEmailAddress
              emailAddress={formData.emailAddress}
              done={this.finish}
            />
          )}
      </Dialog>
    );
  }
}

AddEmailAddressDialog.propTypes = {
  attachLocalAuth: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  startAttach: PropTypes.func.isRequired,
  finishAttach: PropTypes.func.isRequired,
};

export default AddEmailAddressDialog;
