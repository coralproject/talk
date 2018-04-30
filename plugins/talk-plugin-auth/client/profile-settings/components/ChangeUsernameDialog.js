import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './ChangeUsernameDialog.css';
import InputField from './InputField';
import { Button, Dialog } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

class ChangeUsernameDialog extends React.Component {
  state = {
    showError: false,
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

    if (!this.props.canUsernameBeUpdated) {
      this.props.notify(
        'error',
        "Username can't be updated. Usernames can be changed every 14 days"
      );
      return;
    }

    await this.props.saveChanges();
    this.props.closeDialog();
  };

  formHasError = () =>
    this.props.formData.confirmNewUsername !== this.props.formData.newUsername;

  render() {
    return (
      <Dialog
        open={this.props.showDialog}
        className={cn(styles.dialog, 'talk-plugin-auth--edit-profile-dialog')}
      >
        <span className={styles.close} onClick={this.props.closeDialog}>
          ×
        </span>
        <h1 className={styles.title}>
          {t('talk-plugin-auth.change_username.confirm_username_change')}
        </h1>
        <div className={styles.content}>
          <p className={styles.description}>
            {t('talk-plugin-auth.change_username.description')}
          </p>
          <div className={styles.usernamesChange}>
            <span className={styles.item}>
              {t('talk-plugin-auth.change_username.old_username')}:{' '}
              {this.props.username}
            </span>
            <span className={styles.item}>
              {t('talk-plugin-auth.change_username.new_username')}:{' '}
              {this.props.formData.newUsername}
            </span>
          </div>
          <form>
            <InputField
              id="confirmNewUsername"
              label="Re-enter new username"
              name="confirmNewUsername"
              type="text"
              onChange={this.props.onChange}
              defaultValue=""
              hasError={this.formHasError() && this.state.showError}
              errorMsg={t(
                'talk-plugin-auth.change_username.username_does_not_match'
              )}
              showError={this.state.showError}
              columnDisplay
              showSuccess={false}
              validationType="username"
            >
              <span className={styles.bottomNote}>
                {t('talk-plugin-auth.change_username.bottom_note')}
              </span>
            </InputField>
          </form>
          <div className={styles.bottomActions}>
            <Button className={styles.cancel}>
              {t('talk-plugin-auth.change_username.cancel')}
            </Button>
            <Button
              className={styles.confirmChanges}
              onClick={this.confirmChanges}
            >
              {t('talk-plugin-auth.change_username.confirm_changes')}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

ChangeUsernameDialog.propTypes = {
  saveChanges: PropTypes.func,
  closeDialog: PropTypes.func,
  showDialog: PropTypes.bool,
  onChange: PropTypes.func,
  username: PropTypes.string,
  formData: PropTypes.object,
  canUsernameBeUpdated: PropTypes.bool.isRequired,
  notify: PropTypes.func.isRequired,
};

export default ChangeUsernameDialog;
