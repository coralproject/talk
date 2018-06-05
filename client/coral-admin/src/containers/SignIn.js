import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSignIn, withPopupAuthHandler } from 'coral-framework/hocs';
import { compose } from 'recompose';
import SignIn from '../components/SignIn';

class SignInContainer extends Component {
  state = {
    email: '',
    password: '',
    recaptchaResponse: null,
  };

  handleSubmit = () => {
    this.props.signIn(
      this.state.email,
      this.state.password,
      this.state.recaptchaResponse
    );
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  handleRecaptchaVerify = recaptchaResponse => {
    this.setState({ recaptchaResponse });
  };

  render() {
    return (
      <SignIn
        onSubmit={this.handleSubmit}
        onEmailChange={this.handleEmailChange}
        onPasswordChange={this.handlePasswordChange}
        email={this.state.email}
        password={this.state.password}
        errorMessage={this.props.errorMessage}
        onForgotPasswordLink={this.props.onForgotPasswordLink}
        onRecaptchaVerify={this.handleRecaptchaVerify}
        requireRecaptcha={this.props.requireRecaptcha}
      />
    );
  }
}

SignInContainer.propTypes = {
  signIn: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  onForgotPasswordLink: PropTypes.func.isRequired,
  requireRecaptcha: PropTypes.bool.isRequired,
};

export default compose(
  withSignIn,
  withPopupAuthHandler
)(SignInContainer);
