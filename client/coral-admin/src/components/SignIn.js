import React from 'react';
import PropTypes from 'prop-types';
import styles from './SignIn.css';
import { Button, TextField, Alert } from 'coral-ui';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
  }

  handleForgotPasswordLink = e => {
    e.preventDefault();
    this.props.onForgotPasswordLink();
  };
  handleEmailChange = e => this.props.onEmailChange(e.target.value);
  handlePasswordChange = e => this.props.onPasswordChange(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { email, password, errorMessage } = this.props;
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
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  requireRecaptcha: PropTypes.bool.isRequired,
};

export default SignIn;
