import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './ChangeUsername.css';
import { Button } from 'plugin-api/beta/client/components/ui';
import ChangeUsernameDialog from './ChangeUsernameDialog';
import { t } from 'plugin-api/beta/client/services';
import InputField from './InputField';
import { getErrorMessages } from 'coral-framework/utils';
import { canUsernameBeUpdated } from 'coral-framework/utils/user';

const initialState = {
  editing: false,
  showDialog: false,
  formData: {},
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
  };

  saveChanges = async () => {
    const { newUsername } = this.state.formData;
    const { setUsername } = this.props;

    try {
      await setUsername(newUsername);
      this.props.notify(
        'success',
        t('talk-plugin-auth.change_username.changed_username_success_msg')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }

    this.clearForm();
    this.disableEditing();
  };

  onChange = e => {
    const { name, value } = e.target;

    this.setState(state => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    }));
  };

  closeDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  render() {
    const {
      username,
      emailAddress,
      root: { me: { state: { status } } },
      notify,
    } = this.props;
    const { editing, formData, showDialog } = this.state;

    return (
      <section
        className={cn('talk-plugin-auth--edit-profile', styles.container, {
          [styles.editing]: editing,
        })}
      >
        <ChangeUsernameDialog
          canUsernameBeUpdated={canUsernameBeUpdated(status)}
          showDialog={showDialog}
          onChange={this.onChange}
          formData={formData}
          username={username}
          closeDialog={this.closeDialog}
          saveChanges={this.saveChanges}
          notify={notify}
        />

        {editing ? (
          <div className={styles.content}>
            <div className={styles.detailList}>
              <InputField
                icon="person"
                id="newUsername"
                name="newUsername"
                onChange={this.onChange}
                defaultValue={username}
                columnDisplay
                validationType="username"
              >
                <span className={styles.bottomText}>
                  {t('talk-plugin-auth.change_username.change_username_note')}
                </span>
              </InputField>
              <InputField
                icon="email"
                id="email"
                name="email"
                value={emailAddress}
                validationType="username"
                disabled
              />
            </div>
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
              disabled={
                !this.state.formData.newUsername ||
                this.state.formData.newUsername === username
              }
            >
              {t('talk-plugin-auth.change_username.save')}
            </Button>
            <a className={styles.cancelButton} onClick={this.cancel}>
              {t('talk-plugin-auth.change_username.cancel')}
            </a>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button
              className={styles.button}
              icon="settings"
              onClick={this.enableEditing}
            >
              {t('talk-plugin-auth.change_username.edit_profile')}
            </Button>
          </div>
        )}
      </section>
    );
  }
}

ChangeUsername.propTypes = {
  root: PropTypes.object.isRequired,
  setUsername: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
};

export default ChangeUsername;
