import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './Profile.css';
import { Button, BareButton } from 'plugin-api/beta/client/components/ui';
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

  onSave = async e => {
    e.preventDefault();

    if (this.isSaveEnabled()) {
      this.showDialog();
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

  fieldValidation = (value, type, name) => {
    if (!value.length) {
      this.addError({
        [name]: t('talk-plugin-local-auth.change_password.required_field'),
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
    const {
      root: {
        me: { username, email },
      },
    } = this.props;
    const formHasErrors = !!Object.keys(this.state.errors).length;
    const validUsername =
      formData.newUsername && formData.newUsername !== username;
    const validEmail = formData.newEmail && formData.newEmail !== email;

    return !formHasErrors && (validUsername || validEmail);
  };

  saveUsername = async () => {
    const { newUsername } = this.state.formData;
    const { setUsername } = this.props;

    try {
      await setUsername(newUsername);
      this.props.notify(
        'success',
        t('talk-plugin-local-auth.change_username.changed_username_success_msg')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  saveEmail = async confirmPassword => {
    const { newEmail } = this.state.formData;

    try {
      await this.props.updateEmailAddress({
        email: newEmail,
        confirmPassword,
      });
      this.props.notify(
        'success',
        t('talk-plugin-local-auth.change_email.change_email_msg')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  getError = errorKey => {
    return this.state.errors[errorKey];
  };

  finish = () => {
    this.clearForm();
    this.disableEditing();
  };

  render() {
    const {
      root: {
        me: {
          username,
          email,
          state: { status },
        },
      },
      notify,
      success: hasChangedUsername,
    } = this.props;
    const { editing, formData, showDialog } = this.state;

    const usernameCanBeUpdated =
      canUsernameBeUpdated(status) && !hasChangedUsername;

    return (
      <section
        className={cn(
          'talk-plugin-local-auth--edit-profile',
          styles.container,
          {
            [styles.editing]: editing,
          }
        )}
      >
        <ConfirmChangesDialog
          showDialog={showDialog}
          closeDialog={this.closeDialog}
          finish={this.finish}
        >
          {usernameCanBeUpdated && (
            <ChangeUsernameContentDialog
              notify={notify}
              canUsernameBeUpdated={usernameCanBeUpdated}
              save={this.saveUsername}
              onChange={this.onChange}
              formData={this.state.formData}
              username={username}
              enable={formData.newUsername && username !== formData.newUsername}
              hasError={this.hasError}
            />
          )}
          <ChangeEmailContentDialog
            save={this.saveEmail}
            formData={this.state.formData}
            email={email}
            enable={formData.newEmail && email !== formData.newEmail}
            closeDialog={this.closeDialog}
          />
        </ConfirmChangesDialog>

        {editing ? (
          <form className={styles.wrapper} onSubmit={this.onSave}>
            <div className={styles.content}>
              <div className={styles.detailList}>
                <InputField
                  icon="person"
                  id="newUsername"
                  name="newUsername"
                  onChange={this.onChange}
                  defaultValue={username}
                  validationType="username"
                  disabled={!usernameCanBeUpdated}
                  columnDisplay
                  errorMsg={this.state.errors.newUsername}
                >
                  <div className={styles.bottomText}>
                    <span>
                      {t(
                        'talk-plugin-local-auth.change_username.change_username_note'
                      )}
                    </span>
                    {!usernameCanBeUpdated && (
                      <b>
                        {' '}
                        {t(
                          'talk-plugin-local-auth.change_username.is_not_eligible'
                        )}
                      </b>
                    )}
                  </div>
                </InputField>
                <InputField
                  icon="email"
                  id="newEmail"
                  name="newEmail"
                  onChange={this.onChange}
                  defaultValue={email}
                  validationType="email"
                  columnDisplay
                />
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                className={cn(styles.button, styles.saveButton)}
                icon="save"
                type="submit"
                disabled={!this.isSaveEnabled()}
              >
                {t('talk-plugin-local-auth.change_username.save')}
              </Button>
              <BareButton
                className={styles.cancelButton}
                onClick={this.cancel}
                type="button"
              >
                {t('talk-plugin-local-auth.change_username.cancel')}
              </BareButton>
            </div>
          </form>
        ) : (
          <div className={styles.wrapper}>
            <div className={styles.content}>
              <h2 className={styles.username}>{username}</h2>
              {email ? <p className={styles.email}>{email}</p> : null}
            </div>
            <div className={styles.actions}>
              <Button
                className={styles.button}
                icon="settings"
                onClick={this.enableEditing}
              >
                {t('talk-plugin-local-auth.change_username.edit_profile')}
              </Button>
            </div>
          </div>
        )}
      </section>
    );
  }
}

Profile.propTypes = {
  updateEmailAddress: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  notify: PropTypes.func.isRequired,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
  success: PropTypes.bool.isRequired,
};

export default Profile;
