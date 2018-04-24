import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './ChangePassword.css';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

class ChangePassword extends React.Component {
  state = {
    editing: false,
    showErrors: true,
    errors: {},
    formData: {},
  };

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
      this.addError({ [field2]: 'Passwords don`t match' });
    } else {
      this.removeError(field2);
    }
    return cond;
  };

  fieldValidation = (value, type, name) => {
    if (!validate[type](value)) {
      this.addError({ [name]: errorMsj[type] });
    } else {
      this.removeError(name);
    }
  };

  onSave = () => {
    // errors is empty

    const { formData } = this.state;
    const validKeys = Object.keys(formData);

    // Required Validation
    const validation = validKeys.filter(name => {
      const cond = !formData[name].length;
      if (cond) {
        this.addError({
          [name]: 'This Field is required',
        });
      } else {
        this.removeError(name);
      }
      return cond;
    });

    if (validation.length) {
      //error
      return;
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

  toggleEditing = () => {
    this.setState(({ editing }) => ({
      editing: !editing,
    }));
  };

  disableEditing = () => {
    this.setState(() => ({
      editing: false,
    }));
  };

  render() {
    const { editing, errors } = this.state;
    console.log(
      Object.keys(this.state.formData).length,
      Object.keys(this.state.errors).length
    );
    return (
      <section
        className={cn('talk-plugin-auth--change-password', styles.container, {
          [styles.editing]: editing,
        })}
      >
        <h3 className={styles.title}>Change Password</h3>
        {editing && (
          <ul className={styles.detailList}>
            <InputField
              id="oldPassword"
              label="Old Password"
              name="oldPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.oldPassword}
              hasError={this.hasError('oldPassword')}
              errorMsg={errors['oldPassword']}
              showErrors
            >
              <span className={styles.detailBottomBox}>
                <a className={styles.detailLink}>Forgot your password?</a>
              </span>
            </InputField>
            <InputField
              id="newPassword"
              label="New Password"
              name="newPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.newPassword}
              hasError={this.hasError('newPassword')}
              errorMsg={errors['newPassword']}
              showErrors
            />
            <InputField
              id="confirmNewPassword"
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              onChange={this.onChange}
              value={this.state.formData.confirmNewPassword}
              hasError={this.hasError('confirmNewPassword')}
              errorMsg={errors['confirmNewPassword']}
              showErrors
            />
          </ul>
        )}
        {editing ? (
          <div className={styles.actions}>
            <Button
              className={cn(styles.button, styles.saveButton)}
              icon="save"
              onClick={this.onSave}
            >
              Save
            </Button>
            <a className={styles.cancelButton} onClick={this.toggleEditing}>
              Cancel
            </a>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button className={styles.button} onClick={this.toggleEditing}>
              Edit
            </Button>
          </div>
        )}
      </section>
    );
  }
}

ChangePassword.propTypes = {
  changePassword: PropTypes.func,
};

const InputField = ({
  id = '',
  label = '',
  type = 'text',
  name = '',
  onChange = () => {},
  value = '',
  showError = true,
  hasError = false,
  errorMsg = '',
  children,
}) => {
  return (
    <li className={styles.detailItem}>
      <div className={styles.detailItemContainer}>
        <div className={styles.detailItemContent}>
          <label className={styles.detailLabel} id={id}>
            {label}
          </label>
          <input
            id={id}
            type={type}
            name={name}
            className={styles.detailValue}
            onChange={onChange}
            value={value}
          />
        </div>
        <div className={styles.detailItemMessage}>
          {!hasError &&
            value && <Icon className={styles.checkIcon} name="check_circle" />}
          {hasError && showError && <ErrorMessage>{errorMsg}</ErrorMessage>}
        </div>
      </div>
      {children}
    </li>
  );
};

const ErrorMessage = ({ children }) => (
  <div className={styles.errorMsg}>
    <Icon className={styles.warningIcon} name="warning" />
    <span>{children}</span>
  </div>
);

ErrorMessage.propTypes = {
  children: PropTypes.node,
};

export default ChangePassword;
