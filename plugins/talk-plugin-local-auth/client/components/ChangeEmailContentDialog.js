import React from 'react';
import PropTypes from 'prop-types';
import styles from './ChangeEmailContentDialog.css';
import InputField from './InputField';
import { Button } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

class ChangeEmailContentDialog extends React.Component {
  state = {
    showError: false,
  };

  showError = () => {
    this.setState({
      showError: true,
    });
  };

  confirmChanges = async () => {
    await this.props.save();
    this.props.next();
  };

  render() {
    return (
      <div>
        <span className={styles.close} onClick={this.props.cancel}>
          ×
        </span>
        <h1 className={styles.title}>
          {t('talk-plugin-local-auth.change_email.confirm_email_change')}
        </h1>
        <div className={styles.content}>
          <p className={styles.description}>
            {t('talk-plugin-local-auth.change_email.description')}
          </p>
          <div className={styles.emailChange}>
            <span className={styles.item}>
              {t('talk-plugin-local-auth.change_email.old_email')}:{' '}
              {this.props.email}
            </span>
            <span className={styles.item}>
              {t('talk-plugin-local-auth.change_email.new_email')}:{' '}
              {this.props.formData.newEmail}
            </span>
          </div>
          <form>
            <InputField
              id="confirmPassword"
              label={t('talk-plugin-local-auth.change_email.enter_password')}
              name="confirmPassword"
              type="password"
              onChange={this.props.onChange}
              defaultValue=""
              hasError={
                !this.props.formData.confirmPassword && this.state.showError
              }
              errorMsg={t(
                'talk-plugin-local-auth.change_email.incorrect_password'
              )}
              showError={this.state.showError}
              columnDisplay
              showSuccess={false}
            />
          </form>
          <div className={styles.bottomActions}>
            <Button className={styles.cancel} onClick={this.props.cancel}>
              {t('talk-plugin-local-auth.change_email.cancel')}
            </Button>
            <Button
              className={styles.confirmChanges}
              onClick={this.confirmChanges}
            >
              {t('talk-plugin-local-auth.change_email.confirm_change')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

ChangeEmailContentDialog.propTypes = {
  save: PropTypes.func,
  next: PropTypes.func,
  cancel: PropTypes.func,
  onChange: PropTypes.func,
  formData: PropTypes.object,
  email: PropTypes.string,
};

export default ChangeEmailContentDialog;
