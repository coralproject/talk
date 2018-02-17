import React, { Component } from 'react';
import SignIn from '../containers/SignIn';
import ForgotPassword from '../containers/ForgotPassword';
import PropTypes from 'prop-types';
import styles from './Login.css';
import Layout from 'coral-admin/src/components/Layout';
import cn from 'classnames';

class LoginContainer extends Component {
  renderForm() {
    return this.props.forgotPassword ? (
      <ForgotPassword onSignInLink={this.props.onSignInLink} />
    ) : (
      <SignIn onForgotPasswordLink={this.props.onForgotPasswordLink} />
    );
  }

  render() {
    return (
      <Layout fixedDrawer restricted={true}>
        <div className={cn(styles.layout, 'talk-admin-login')}>
          <h1 className={styles.header}>Team sign in</h1>
          <p className={styles.cta}>Sign in to interact with your community.</p>
          {this.renderForm()}
        </div>
      </Layout>
    );
  }
}

LoginContainer.propTypes = {
  forgotPassword: PropTypes.bool.isRequired,
  onForgotPasswordLink: PropTypes.func.isRequired,
  onSignInLink: PropTypes.func.isRequired,
};

export default LoginContainer;
