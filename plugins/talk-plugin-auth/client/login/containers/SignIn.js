import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSignIn } from 'coral-framework/hocs';
import { compose } from 'recompose';
import SignIn from '../components/SignIn';

class SignInContainer extends Component {
  state = {
    email: '',
    password: '',
    recaptchaResponse: '',
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      window.close();
    }
  }

  render() {
    return (
      <SignIn
        onSubmit={this.handleSubmit}
        onEmailChange={this.handleEmailChange}
        onPasswordChange={this.handlePasswordChange}
        email={this.state.email}
        password={this.state.password}
        errorMessage={this.props.errorMessage}
        onRecaptchaVerify={this.handleRecaptchaVerify}
        requireRecaptcha={this.props.requireRecaptcha}
        loading={this.props.loading}
      />
    );
  }
}

SignInContainer.propTypes = {
  signIn: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  requireRecaptcha: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
};

export default compose(withSignIn)(SignInContainer);
