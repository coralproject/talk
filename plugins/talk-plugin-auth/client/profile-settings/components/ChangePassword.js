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
        this.equalityValidation('newPassword', 'confirmNewPassword');
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
    console.log(this.state.errors);
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
    const { formData, showErrors, editing, errors } = this.state;

    return (
      <section
        className={cn('talk-plugin-auth--change-password', styles.container, {
          [styles.editing]: editing,
        })}
      >
        <h3 className={styles.title}>Change Password</h3>
        {editing && (
          <ul className={styles.detailList}>
            <li className={styles.detailItem}>
              <div className={styles.detailItemContainer}>
                <div className={styles.detailItemContent}>
                  <label className={styles.detailLabel}>Old Password</label>
                  <input
                    name="oldPassword"
                    type="password"
                    className={styles.detailValue}
                    onChange={this.onChange}
                  />
                </div>
                <div className={styles.detailItemMessage}>
                  {!this.hasError('oldPassword') &&
                  formData.oldPassword.length ? (
                    <Icon className={styles.checkIcon} name="check_circle" />
                  ) : null}
                  {showErrors &&
                    this.hasError('oldPassword') && (
                      <ErrorMessage>{errors['oldPassword']}</ErrorMessage>
                    )}
                </div>
              </div>
              <span className={styles.detailBottomBox}>
                <a className={styles.detailLink}>Forgot your password?</a>
              </span>
            </li>
            <li className={styles.detailItem}>
              <div className={styles.detailItemContainer}>
                <div className={styles.detailItemContent}>
                  <label className={styles.detailLabel}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className={styles.detailValue}
                    onChange={this.onChange}
                  />
                </div>
                <div className={styles.detailItemMessage}>
                  {!this.hasError('newPassword') &&
                  !this.hasError('matchPasswords') &&
                  formData.newPassword.length ? (
                    <Icon className={styles.checkIcon} name="check_circle" />
                  ) : null}
                  {showErrors &&
                    this.hasError('newPassword') && (
                      <ErrorMessage>{errors['newPassword']}</ErrorMessage>
                    )}
                </div>
              </div>
            </li>
            <li className={styles.detailItem}>
              <div className={styles.detailItemContainer}>
                <div className={styles.detailItemContent}>
                  <label className={styles.detailLabel}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    className={styles.detailValue}
                    onChange={this.onChange}
                  />
                </div>
                <div className={styles.detailItemMessage}>
                  {!this.hasError('confirmNewPassword') &&
                  !this.hasError('confirmNewPassword') &&
                  formData.confirmNewPassword.length ? (
                    <Icon className={styles.checkIcon} name="check_circle" />
                  ) : null}
                  {showErrors &&
                    this.hasError('confirmNewPassword') && (
                      <ErrorMessage>
                        {errors['confirmNewPassword']}
                      </ErrorMessage>
                    )}
                </div>
              </div>
            </li>
          </ul>
        )}
        {editing ? (
          <div className={styles.actions}>
            <Button
              className={cn(styles.button, styles.saveButton)}
              icon="save"
              onClick={this.onSave}
              disabled={
                Object.keys(this.state.formData).length &&
                Object.keys(this.state.errors).length
              }
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
