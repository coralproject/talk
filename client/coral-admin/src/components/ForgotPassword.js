import React from 'react';
import PropTypes from 'prop-types';
import styles from './ForgotPassword.css';
import { Button, TextField, Alert, Success } from 'coral-ui';
import t from 'coral-framework/services/i18n';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
  }

  handleEmailChange = e => this.props.onEmailChange(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  handleSignInLink = e => {
    e.preventDefault();
    this.props.onSignInLink();
  };

  renderSuccess() {
    return (
      <div className={styles.success} onClick={this.handleSignInLink}>
        {t('password_reset.mail_sent')}{' '}
        <a
          className={styles.signInLink}
          href="#"
          onClick={this.handleSignInLink}
        >
          {t('login.sign_in')}
        </a>
        <Success />
      </div>
    );
  }

  renderForm() {
    const { email, errorMessage } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        {errorMessage && <Alert>{errorMessage}</Alert>}
        <TextField
          label={t('login.email_address')}
          value={email}
          onChange={this.handleEmailChange}
        />
        <Button type="submit" cStyle="black" full>
          {t('login.reset_password_send_button')}
        </Button>
        <p className={styles.cta}>
          {t('login.go_back')}{' '}
          <a
            href="#"
            className={styles.signInLink}
            onClick={this.handleSignInLink}
          >
            {t('login.sign_in')}
          </a>
          .
        </p>
      </form>
    );
  }

  render() {
    return this.props.success ? this.renderSuccess() : this.renderForm();
  }
}

ForgotPassword.propTypes = {
  success: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  onSignInLink: PropTypes.func.isRequired,
};

export default ForgotPassword;
