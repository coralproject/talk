import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'coral-admin/src/components/Layout';
import styles from './NotFound.css';
import { Button, TextField, Alert, Success } from 'coral-ui';
import Recaptcha from 'react-recaptcha';
import cn from 'classnames';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', requestPassword: false };
  }

  handleSignIn = e => {
    e.preventDefault();
    this.props.handleLogin(this.state.email, this.state.password);
  };

  onRecaptchaLoad = () => {
    // do something?
  };

  onRecaptchaVerify = recaptchaResponse => {
    this.props.handleLogin(
      this.state.email,
      this.state.password,
      recaptchaResponse
    );
  };

  handleRequestPassword = e => {
    e.preventDefault();
    this.props.requestPasswordReset(this.state.email);
  };

  render() {
    const { errorMessage, loginMaxExceeded, recaptchaPublic } = this.props;
    const signInForm = (
      <form className="talk-admin-login-sign-in" onSubmit={this.handleSignIn}>
        {errorMessage && <Alert>{errorMessage}</Alert>}
        <TextField
          id="email"
          label="Email Address"
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <TextField
          id="password"
          label="Password"
          value={this.state.password}
          onChange={e => this.setState({ password: e.target.value })}
          type="password"
        />
        <div style={{ height: 10 }} />
        <Button
          className="talk-admin-login-sign-in-button"
          type="submit"
          cStyle="black"
          full
          onClick={this.handleSignIn}
        >
          Sign In
        </Button>
        <p className={styles.forgotPasswordCTA}>
          Forgot your password?{' '}
          <a
            href="#"
            className={styles.forgotPasswordLink}
            onClick={e => {
              e.preventDefault();
              this.setState({ requestPassword: true });
            }}
          >
            Request a new one.
          </a>
        </p>
        {loginMaxExceeded && (
          <Recaptcha
            sitekey={recaptchaPublic}
            render="explicit"
            theme="dark"
            onloadCallback={this.onRecaptchaLoad}
            verifyCallback={this.onRecaptchaVerify}
          />
        )}
      </form>
    );
    const requestPasswordForm = this.props.passwordRequestSuccess ? (
      <p
        className={styles.passwordRequestSuccess}
        onClick={() => {
          location.href = location.href;
        }}
      >
        {this.props.passwordRequestSuccess}{' '}
        <a className={styles.signInLink} href="#">
          Sign in
        </a>
        <Success />
      </p>
    ) : (
      <form onSubmit={this.handleRequestPassword}>
        <TextField
          label="Email Address"
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <Button
          type="submit"
          cStyle="black"
          full
          onClick={this.handleRequestPassword}
        >
          Reset Password
        </Button>
      </form>
    );
    return (
      <Layout fixedDrawer restricted={true}>
        <div className={cn(styles.loginLayout, 'talk-admin-login')}>
          <h1 className={styles.loginHeader}>Team sign in</h1>
          <p className={styles.loginCTA}>
            Sign in to interact with your community.
          </p>
          {this.state.requestPassword ? requestPasswordForm : signInForm}
        </div>
      </Layout>
    );
  }
}

AdminLogin.propTypes = {
  loginMaxExceeded: PropTypes.bool.isRequired,
  handleLogin: PropTypes.func.isRequired,
  passwordRequestSuccess: PropTypes.string,
  loginError: PropTypes.string,
  recaptchaPublic: PropTypes.string,
  requestPasswordReset: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default AdminLogin;
