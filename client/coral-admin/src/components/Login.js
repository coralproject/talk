import React, { Component } from 'react';
import SignIn from '../containers/SignIn';
import ForgotPassword from '../containers/ForgotPassword';
import PropTypes from 'prop-types';
import styles from './Login.css';
import Layout from 'coral-admin/src/components/Layout';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';

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
          <h1 className={styles.header}>{t('login.team_sign_in')}</h1>
          <p className={styles.cta}>{t('login.sign_in_message')}</p>
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
