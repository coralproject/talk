import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './Profile.css';
import { Button } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import InputField from './InputField';
import { getErrorMessages } from 'coral-framework/utils';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import ConfirmChangesDialog from './ConfirmChangesDialog';
import ChangeUsernameContentDialog from './ChangeUsernameContentDialog';
import ChangeEmailContentDialog from './ChangeEmailContentDialog';
import { canUsernameBeUpdated } from 'coral-framework/utils/user';

const initialState = {
  editing: false,
  showDialog: false,
  formData: {},
  errors: {},
};

class Profile extends React.Component {
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
        [name]: t('talk-plugin-auth.change_password.required_field'),
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

  closeDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  hasError = err => {
    return Object.keys(this.state.errors).indexOf(err) !== -1;
  };

  isSaveEnabled = () => {
    const { formData } = this.state;
    const { emailAddress, username } = this.props;
    const formHasErrors = !!Object.keys(this.state.errors).length;
    const validUsername =
      formData.newUsername && formData.newUsername !== username;
    const validEmail = formData.newEmail && formData.newEmail !== emailAddress;

    return !formHasErrors && (validUsername || validEmail);
  };

  saveUsername = async () => {
    const { newUsername } = this.state.formData;
    const { changeUsername } = this.props;

    try {
      await changeUsername(this.props.root.me.id, newUsername);
      this.props.notify(
        'success',
        t('talk-plugin-auth.change_username.changed_username_success_msg')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  saveEmail = async () => {
    const { newEmail, confirmPassword } = this.state.formData;

    try {
      await this.props.updateEmailAddress({
        email: newEmail,
        confirmPassword,
      });
      this.props.notify(
        'success',
        t('talk-plugin-auth.change_email.change_email_msg')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  finish = () => {
    this.clearForm();
    this.disableEditing();
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
        <ConfirmChangesDialog
          showDialog={showDialog}
          closeDialog={this.closeDialog}
          finish={this.finish}
        >
          <ChangeUsernameContentDialog
            notify={notify}
            canUsernameBeUpdated={canUsernameBeUpdated(status)}
            save={this.saveUsername}
            onChange={this.onChange}
            formData={this.state.formData}
            username={username}
            enable={formData.newUsername && username !== formData.newUsername}
          />
          <ChangeEmailContentDialog
            save={this.saveEmail}
            onChange={this.onChange}
            formData={this.state.formData}
            emailAddress={emailAddress}
            enable={formData.newEmail && emailAddress !== formData.newEmail}
          />
        </ConfirmChangesDialog>

        {editing ? (
          <div className={styles.content}>
            <div className={styles.detailList}>
              <InputField
                icon="person"
                id="newUsername"
                name="newUsername"
                onChange={this.onChange}
                defaultValue={username}
                validationType="username"
                columnDisplay
              >
                <span className={styles.bottomText}>
                  {t('talk-plugin-auth.change_username.change_username_note')}
                </span>
              </InputField>
              <InputField
                icon="email"
                id="newEmail"
                name="newEmail"
                onChange={this.onChange}
                defaultValue={emailAddress}
                validationType="email"
                columnDisplay
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
              disabled={!this.isSaveEnabled()}
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

Profile.propTypes = {
  updateEmailAddress: PropTypes.func.isRequired,
  changeUsername: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  changeUsername: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
};

export default Profile;
