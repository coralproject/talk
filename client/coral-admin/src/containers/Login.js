import React, { Component } from 'react';
import Login from '../components/Login';

class LoginContainer extends Component {
  state = {
    forgotPassword: false,
  };

  switchToForgotPassword = () => {
    this.setState({ forgotPassword: true });
  };

  switchToSignIn = () => {
    this.setState({ forgotPassword: false });
  };

  render() {
    return (
      <Login
        forgotPassword={this.state.forgotPassword}
        onForgotPasswordLink={this.switchToForgotPassword}
        onSignInLink={this.switchToSignIn}
      />
    );
  }
}

LoginContainer.propTypes = {};

export default LoginContainer;
