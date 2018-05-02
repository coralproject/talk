import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './AddEmailAddressDialog.css';
import { Button, Dialog, Icon } from 'plugin-api/beta/client/components/ui';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import InputField from './InputField';
import { getErrorMessages } from 'coral-framework/utils';

const initialState = {
  showErrors: false,
  errors: {},
  formData: {},
};

class AddEmailAddressDialog extends React.Component {
  state = initialState;
  validKeys = ['emailAddress', 'confirmEmailAddress'];

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

  showError = () => {
    this.setState({
      showError: true,
    });
  };

  confirmChanges = async () => {
    if (this.formHasError()) {
      this.showError();
      return;
    }

    const { emailAddress } = this.state.formData;
    const { attachLocalAuth } = this.props;

    try {
      await attachLocalAuth({
        email: emailAddress,
      });
      this.props.notify('success', 'Email Added!');
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  render() {
    const { errors, formData, showErrors } = this.state;
    return (
      <Dialog className={styles.dialog} open={true}>
        <h4 className={styles.title}>Add an Email Address</h4>
        <p className={styles.description}>
          For your added security, we require users to add an email address to
          their accounts. Your email address will be used to:
        </p>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Icon name="done" className={styles.itemIcon} />
            <span className={styles.text}>
              Receive updates regarding any changes to your account (email
              address, username, password, etc.)
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
        <InputField
          id="emailAddress"
          label="Enter Email Address:"
          name="emailAddress"
          type="email"
          onChange={this.onChange}
          defaultValue=""
          hasError={
            (!formData.emailAddress || errors.emailAddress) && showErrors
          }
          errorMsg={errors.emailAddress}
          showError={this.state.showError}
          columnDisplay
          showSuccess={false}
        />
        <InputField
          id="confirmEmailAddress"
          label="Confirm Email Address:"
          name="confirmEmailAddress"
          type="email"
          onChange={this.onChange}
          defaultValue=""
          hasError={
            (!formData.emailAddress ||
              formData.emailAddress !== formData.confirmEmailAddress) &&
            showErrors
          }
          errorMsg={'Email address does not match'}
          showError={this.state.showError}
          columnDisplay
          showSuccess={false}
        />
        <Button className={cn(styles.button, styles.proceed)} full>
          Add Email Address
        </Button>
      </Dialog>
    );
  }
}

AddEmailAddressDialog.propTypes = {
  attachLocalAuth: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

export default AddEmailAddressDialog;
