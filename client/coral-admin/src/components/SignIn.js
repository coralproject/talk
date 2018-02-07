import React from 'react';
import PropTypes from 'prop-types';
import styles from './SignIn.css';
import { Button, TextField, Alert } from 'coral-ui';
import Recaptcha from 'coral-framework/components/Recaptcha';

class SignIn extends React.Component {
  recaptcha = null;

  handleForgotPasswordLink = e => {
    e.preventDefault();
    this.props.onForgotPasswordLink();
  };
  handleEmailChange = e => this.props.onEmailChange(e.target.value);
  handlePasswordChange = e => this.props.onPasswordChange(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();

    // Reset recaptcha because each response can only
    // be used once.
    if (this.recaptcha) {
      this.recaptcha.reset();
    }
  };

  handleRecaptchaRef = ref => {
    this.recaptcha = ref;
    setTimeout(() => {
      console.log(ref);
    }, 1000)
  };

  render() {
    const { email, password, errorMessage, requireRecaptcha } = this.props;
    return (
      <form className="talk-admin-login-sign-in" onSubmit={this.handleSubmit}>
        {errorMessage && <Alert>{errorMessage}</Alert>}
        <TextField
          id="email"
          label="Email Address"
          value={email}
          onChange={this.handleEmailChange}
        />
        <TextField
          id="password"
          label="Password"
          value={password}
          onChange={this.handlePasswordChange}
          type="password"
        />
        <div style={{ height: 10 }} />
        <Button
          className="talk-admin-login-sign-in-button"
          type="submit"
          cStyle="black"
          full
        >
          Sign In
        </Button>
        <p className={styles.forgotPasswordCTA}>
          Forgot your password?{' '}
          <a
            href="#"
            className={styles.forgotPasswordLink}
            onClick={this.handleForgotPasswordLink}
          >
            Request a new one.
          </a>
        </p>
        {requireRecaptcha && (
          <Recaptcha
            ref={this.handleRecaptchaRef}
            onVerify={this.props.onRecaptchaVerify}
          />
        )}
      </form>
    );
  }
}

SignIn.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onForgotPasswordLink: PropTypes.func.isRequired,
  onRecaptchaVerify: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  requireRecaptcha: PropTypes.bool.isRequired,
};

export default SignIn;
