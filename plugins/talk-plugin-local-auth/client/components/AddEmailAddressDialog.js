import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import { getErrorMessages } from 'coral-framework/utils';
import styles from './AddEmailAddressDialog.css';

import AddEmailContent from './AddEmailContent';
import VerifyEmailAddress from './VerifyEmailAddress';
import EmailAddressAdded from './EmailAddressAdded';

const initialState = {
  step: 0,
  showErrors: false,
  errors: {},
  formData: {},
};

class AddEmailAddressDialog extends React.Component {
  state = initialState;
  validKeys = ['emailAddress', 'confirmEmailAddress', 'confirmPassword'];

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
      }
    );
  };

  fieldValidation = (value, type, name) => {
    if (!value.length) {
      this.addError({
        [name]: 'Field is required',
      });
    } else if (!validate[type](value)) {
      this.addError({ [name]: errorMsj[type] });
    } else {
      this.removeError(name);
    }
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

  hasError = err => {
    return Object.keys(this.state.errors).indexOf(err) !== -1;
  };

  formHasError = () => {
    const formHasErrors = !!Object.keys(this.state.errors).length;
    const formIncomplete = !isEqual(
      Object.keys(this.state.formData),
      this.validKeys
    );
    return formHasErrors || formIncomplete;
  };

  showErrors = () => {
    this.setState({
      showErrors: true,
    });
  };

  confirmChanges = async () => {
    if (this.formHasError()) {
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
      this.props.notify('success', 'Email Added!');
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
    const { root: { settings } } = this.props;
    return (
      <Dialog className={styles.dialog} open={true}>
        {step === 0 && (
          <AddEmailContent
            formData={formData}
            errors={errors}
            showErrors={showErrors}
          />
        )}
        {step === 1 && !settings.requireEmailConfirmation ? (
          <EmailAddressAdded />
        ) : (
          <VerifyEmailAddress emailAddress={formData.emailAddress} />
        )}
      </Dialog>
    );
  }
}

AddEmailAddressDialog.propTypes = {
  attachLocalAuth: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  root: PropTypes.func.isRequired,
};

export default AddEmailAddressDialog;
