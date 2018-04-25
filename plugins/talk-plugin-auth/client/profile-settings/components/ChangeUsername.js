import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './ChangeUsername.css';
import { Icon, Button } from 'plugin-api/beta/client/components/ui';
import ChangeUsernameDialog from './ChangeUsernameDialog';

const initialState = {
  editing: false,
  formData: {},
  showDialog: false,
};

class ChangeUsername extends React.Component {
  state = initialState;

  clearForm = () => {
    this.setState(initialState);
  };

  enableEditing = () => {
    this.setState({
      editing: true,
    });
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

  showDialog = () => {
    this.setState({
      showDialog: true,
    });
  };

  onSave = async () => {
    this.showDialog();
    // this.clearForm();
    // this.disableEditing();
  };

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
        console.log(this.state.formData);
        // Validation
        // this.fieldValidation(value, type, name);
        // // Perform equality validation if password fields have changed
        // if (name === 'newPassword' || name === 'confirmNewPassword') {
        //   this.equalityValidation('newPassword', 'confirmNewPassword');
        // }
      }
    );
  };

  closeDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  render() {
    const { username, emailAddress } = this.props;
    const { editing } = this.state;

    console.log('loading xxxx');

    return (
      <section
        className={cn('talk-plugin-auth--edit-profile', styles.container, {
          [styles.editing]: editing,
        })}
      >
        <ChangeUsernameDialog
          showDialog={this.state.showDialog}
          onChange={this.onChange}
          formData={this.state.formData}
          username={username}
          closeDialog={this.closeDialog}
        />

        {editing ? (
          <div className={styles.content}>
            <ul className={styles.detailList}>
              <li className={styles.detailItem}>
                <label className={cn(styles.detailLabel)}>
                  <Icon name="person" className={styles.detailLabelIcon} />
                  <input
                    name="username"
                    type="text"
                    className={styles.detailValue}
                    onChange={this.onChange}
                    defaultValue={username}
                  />
                </label>
                <span className={styles.bottomText}>
                  Usernames can be changed every 14 days
                </span>
              </li>
              <li className={styles.detailItem}>
                <label className={cn(styles.detailLabel, styles.disabled)}>
                  <Icon name="email" className={styles.detailLabelIcon} />
                  <input
                    name="email"
                    type="email"
                    className={styles.detailValue}
                    defaultValue={emailAddress}
                    disabled={true}
                  />
                </label>
              </li>
            </ul>
          </div>
        ) : (
          <div className={styles.content}>
            <h2 className={styles.username}>{username}</h2>
            {emailAddress ? (
              <p className={styles.email}>{emailAddress}</p>
            ) : null}
          </div>
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
            <a className={styles.cancelButton} onClick={this.cancel}>
              Cancel
            </a>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button
              className={styles.button}
              icon="settings"
              onClick={this.enableEditing}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </section>
    );
  }
}

ChangeUsername.propTypes = {
  changeUsername: PropTypes.func.isRequired,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
};

export default ChangeUsername;
