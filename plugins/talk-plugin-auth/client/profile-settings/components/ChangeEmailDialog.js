import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './ChangeUsernameDialog.css';
import InputField from './InputField';
import { Button, Dialog } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

class ChangeEmailDialog extends React.Component {
  state = {
    showError: false,
    errors: {
      passowrd: '',
    },
  };

  showError = () => {
    this.setState({
      showError: true,
    });
  };

  confirmChanges = async () => {
    if (this.formHasError()) {
      this.showError();
    } else {
      await this.props.saveChanges();
      this.props.closeDialog();
    }
  };

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
          {t('talk-plugin-auth.change_email.confirm_email_change')}
        </h1>
        <div className={styles.content}>
          <p className={styles.description}>
            {t('talk-plugin-auth.change_email.description')}
          </p>
          <div className={styles.emailChange}>
            <span className={styles.item}>
              {t('talk-plugin-auth.change_email.old_email')}: {this.props.email}
            </span>
            <span className={styles.item}>
              {t('talk-plugin-auth.change_email.new_email')}:{' '}
              {this.props.formData.newEmail}
            </span>
          </div>
          <form>
            <InputField
              id="password"
              label={t('talk-plugin-auth.change_email.enter_password')}
              name="password"
              type="password"
              onChange={this.props.onChange}
              defaultValue=""
              hasError={this.state.errors.password && this.state.showError}
              errorMsg={t('talk-plugin-auth.change_email.incorrect_password')}
              showError={this.state.showError}
              columnDisplay
              showSuccess={false}
            />
          </form>
          <div className={styles.bottomActions}>
            <Button className={styles.cancel}>
              {t('talk-plugin-auth.change_email.cancel')}
            </Button>
            <Button
              className={styles.confirmChanges}
              onClick={this.confirmChanges}
            >
              {t('talk-plugin-auth.change_email.confirm_change')}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

ChangeEmailDialog.propTypes = {
  saveChanges: PropTypes.func,
  closeDialog: PropTypes.func,
  showDialog: PropTypes.bool,
  onChange: PropTypes.func,
  email: PropTypes.string,
  formData: PropTypes.object,
};

export default ChangeEmailDialog;
