import React from 'react';
import cn from 'classnames';
import styles from './ChangePassword.css';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';

class ChangePassword extends React.Component {
  state = { editing: false, errors: [], oldPassword: '' };

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
    return (
      <div
        className={cn(styles.container, {
          [styles.editable]: this.state.editing,
        })}
      >
        <h3 className={styles.title}>Change Password</h3>
        {this.state.editing && (
          <ul className={styles.detailList}>
            <li className={styles.detailItem}>
              <div className={styles.detailItemContainer}>
                <div className={styles.detailItemContent}>
                  <label className={styles.detailLabel}>Old Password</label>
                  <input type="text" className={styles.detailValue} />
                </div>
                <div className={styles.detailItemMessage}>
                  <Icon className={styles.checkIcon} name="check_circle" />
                  {/* <ErrorMessage>Incorrect password. Please try again</ErrorMessage> */}
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
                  <input type="text" className={styles.detailValue} />
                </div>
                <div className={styles.detailItemMessage}>
                  <ErrorMessage>Passwords don’t match</ErrorMessage>
                </div>
              </div>
            </li>
            <li className={styles.detailItem}>
              <div className={styles.detailItemContainer}>
                <div className={styles.detailItemContent}>
                  <label className={styles.detailLabel}>
                    Confirm New Password
                  </label>
                  <input type="text" className={styles.detailValue} />
                </div>
                <div className={styles.detailItemMessage}>
                  <ErrorMessage>Passwords don’t match</ErrorMessage>
                </div>
              </div>
            </li>
          </ul>
        )}
        {this.state.editing ? (
          <div className={styles.actions}>
            <Button
              className={cn(styles.button, styles.saveButton)}
              icon="save"
              onClick={this.toggleEditing}
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
      </div>
    );
  }
}

const ErrorMessage = ({ children }) => (
  <div>
    <Icon className={styles.warningIcon} name="warning" />
    <span className={styles.errorMsg}>{children}</span>
  </div>
);

export default ChangePassword;
