import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSignIn } from 'coral-framework/hocs';
import { compose } from 'recompose';
import SignIn from '../components/SignIn';
import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import * as views from '../enums/views';
import { setView, setEmail, setPassword } from '../actions';

class SignInContainer extends Component {
  state = {
    recaptchaResponse: '',
  };

  handleSubmit = () => {
    this.props.signIn(
      this.props.email,
      this.props.password,
      this.state.recaptchaResponse
    );
  };

  handleRecaptchaVerify = recaptchaResponse => {
    this.setState({ recaptchaResponse });
  };

  handleForgotPasswordLink = () => {
    this.props.setView(views.FORGOT_PASSWORD);
  };

  handleSignUpLink = () => {
    this.props.setView(views.SIGN_UP);
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
        onEmailChange={this.props.setEmail}
        onPasswordChange={this.props.setPassword}
        onForgotPasswordLink={this.handleForgotPasswordLink}
        onSignUpLink={this.handleSignUpLink}
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
  setView: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
};

const mapStateToProps = ({ talkPluginAuth: state }) => ({
  email: state.email,
  password: state.password,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setView,
      setEmail,
      setPassword,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSignIn
)(SignInContainer);
