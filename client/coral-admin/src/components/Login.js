import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'coral-admin/src/components/Layout';
import styles from './Login.css';
import { Button, TextField, Alert } from 'coral-ui';
import cn from 'classnames';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  handleForgotPassword = e => {
    e.preventDefault();
    this.props.onForgotPassword();
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
      <Layout fixedDrawer restricted={true}>
        <div className={cn(styles.loginLayout, 'talk-admin-login')}>
          <h1 className={styles.loginHeader}>Team sign in</h1>
          <p className={styles.loginCTA}>
            Sign in to interact with your community.
          </p>
          <form
            className="talk-admin-login-sign-in"
            onSubmit={this.handleSubmit}
          >
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
                onClick={this.handleForgotPassword}
              >
                Request a new one.
              </a>
            </p>
          </form>
        </div>
      </Layout>
    );
  }
}

AdminLogin.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  onEmailChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
  onForgotPassword: PropTypes.func,
  onSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
  requireRecaptcha: PropTypes.string,
};

export default AdminLogin;
