import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSignIn } from 'coral-framework/hocs';
import { compose } from 'recompose';
import SignIn from '../components/SignIn';

class SignInContainer extends Component {
  state = {
    email: '',
    password: '',
  };

  handleSubmit = () => {
    this.props.signIn(this.state.email, this.state.password);
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
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
        requireRecaptcha={this.props.requireRecaptcha}
      />
    );
  }
}

SignInContainer.propTypes = {
  signIn: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onForgotPasswordLink: PropTypes.func.isRequired,
  requireRecaptcha: PropTypes.bool.isRequired,
};

export default compose(withSignIn)(SignInContainer);
