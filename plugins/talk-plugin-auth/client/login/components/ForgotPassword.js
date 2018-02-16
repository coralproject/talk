import React from 'react';
import PropTypes from 'prop-types';
import styles from './ForgotPassword.css';
import { Button, TextField } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

class ForgotPassword extends React.Component {
  handleSignUpLink = e => {
    e.preventDefault();
    this.props.onSignUpLink();
  };
  handleSignInLink = e => {
    e.preventDefault();
    this.props.onSignInLink();
  };
  handleEmailChange = e => this.props.onEmailChange(e.target.value);
  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { email, errorMessage, success } = this.props;

    return (
      <div>
        <div className={styles.header}>
          <h1>{t('talk-plugin-auth.login.recover_password')}</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.textField}>
            <TextField
              type="email"
              style={{ fontSize: 16 }}
              id="email"
              name="email"
              label={t('talk-plugin-auth.login.email')}
              onChange={this.handleEmailChange}
              value={email}
            />
          </div>
          <Button type="submit" cStyle="black" className={styles.button} full>
            {t('talk-plugin-auth.login.recover_password')}
          </Button>
          {success ? (
            <p className={styles.success}>{t('password_reset.mail_sent')} </p>
          ) : null}
          {errorMessage ? (
            <p className={styles.failure}>{errorMessage}</p>
          ) : null}
        </form>
        <div className={styles.footer}>
          <span>
            {t('talk-plugin-auth.login.need_an_account')}{' '}
            <a onClick={this.handleSignUpLink}>
              {t('talk-plugin-auth.login.register')}
            </a>
          </span>
          <span>
            {t('talk-plugin-auth.login.already_have_an_account')}{' '}
            <a onClick={this.handleSignInLink}>
              {t('talk-plugin-auth.login.sign_in')}
            </a>
          </span>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  success: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  onSignInLink: PropTypes.func.isRequired,
  onSignUpLink: PropTypes.func.isRequired,
};

export default ForgotPassword;
