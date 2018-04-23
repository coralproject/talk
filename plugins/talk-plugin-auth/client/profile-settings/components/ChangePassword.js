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
    errors: [],
    formData: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
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
      this.addError('matchPasswords');
    } else {
      this.removeError('matchPasswords');
    }
    return cond;
  };

  fieldValidation = (value, type, name) => {
    if (!validate[type](value)) {
      this.addError(name);
    } else {
      this.removeError(name);
    }
  };

  formValidation = () => {
    // const { formData } = this.state;
    // const validKeys = Object.keys(formData);
    // // Required Validation
    // const empty = validKeys.filter(name => {
    //   const cond = !formData[name].length;
    //   if (cond) {
    //     this.addError('empty');
    //   } else {
    //     this.removeError()
    //   }
    //   return cond;
    // });
  };

  hasError = err => {
    return this.state.errors.indexOf(err) !== -1;
  };

  addError = err => {
    if (this.state.errors.indexOf(err) === -1) {
      this.setState(({ errors }) => ({
        errors: errors.concat(err),
      }));
    }
  };

  removeError = err => {
    this.setState(({ errors }) => ({
      errors: errors.filter(i => i !== err),
    }));
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
    const { formData, showErrors, editing } = this.state;

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
                      <ErrorMessage>{errorMsj['password']}</ErrorMessage>
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
                      <ErrorMessage>{errorMsj['password']}</ErrorMessage>
                    )}
                  {showErrors &&
                    this.hasError('matchPasswords') && (
                      <ErrorMessage>Passwords don`t match amigo</ErrorMessage>
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
                  !this.hasError('matchPasswords') &&
                  formData.confirmNewPassword.length ? (
                    <Icon className={styles.checkIcon} name="check_circle" />
                  ) : null}
                  {showErrors &&
                    this.hasError('confirmNewPassword') && (
                      <ErrorMessage>{errorMsj['password']}</ErrorMessage>
                    )}
                  {showErrors &&
                    this.hasError('matchPasswords') && (
                      <ErrorMessage>Passwords don`t match amigo</ErrorMessage>
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
              onClick={this.toggleEditing}
              disabled={this.state.errors.length}
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
