import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './ChangeUsername.css';
import { Icon, Button } from 'plugin-api/beta/client/components/ui';
import ChangeUsernameDialog from './ChangeUsernameDialog';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import { t } from 'plugin-api/beta/client/services';
import InputField from './InputField';

const initialState = {
  editing: false,
  showDialog: false,
  errors: {},
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
    // savechanges
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

  hasError = err => {
    return Object.keys(this.state.errors).indexOf(err) !== -1;
  };

  addError = err => {
    this.setState(
      ({ errors }) => ({
        errors: { ...errors, ...err },
      }),
      () => {
        console.log(this.state);
      }
    );
  };

  removeError = errKey => {
    this.setState(
      state => {
        const { [errKey]: _, ...errors } = state.errors;
        return {
          errors,
        };
      },
      () => {
        console.log(this.state);
      }
    );
  };

  onChange = e => {
    const { name, value, type, dataset: { validationType } } = e.target;

    this.setState(
      state => ({
        formData: {
          ...state.formData,
          [name]: value,
        },
      }),
      () => {
        const fieldType = !validationType ? type : validationType;
        this.fieldValidation(value, fieldType, name);
        // the username cannot be the  same
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
                  Usernames can be changed every 14 days
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
              disabled={!this.state.formData.newUsername}
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
