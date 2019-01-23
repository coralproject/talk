import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, withSignUp } from 'plugin-api/beta/client/hocs';
import { compose } from 'recompose';
import SignUp from '../components/SignUp';
import { bindActionCreators } from 'redux';
import * as views from '../enums/views';
import { setView, setEmail, setPassword } from '../actions';
import { t } from 'plugin-api/beta/client/services';

class SignUpContainer extends Component {
  state = {
    username: '',
    passwordRepeat: '',
    usernameError: null,
    emailError: null,
    passwordError: null,
    passwordRepeatError: null,
    blockers: [],
  };

  indicateBlocker = key =>
    this.setState(state => ({
      blockers: state.blockers.concat(key),
    }));

  indicateBlockerResolved = key =>
    this.setState(state => ({
      blockers: state.blockers.filter(i => i !== key),
    }));

  validate = data => {
    let valid = true;
    const changes = {};
    Object.keys(data).forEach(name => {
      const error = this.props.validate(name, data[name]);
      if (error) {
        valid = false;
      }
      changes[`${name}Error`] = error;
    });

    if (data.password !== data.passwordRepeat) {
      changes['passwordRepeatError'] = t(
        'talk-plugin-auth.login.passwords_dont_match'
      );
      valid = false;
    }

    this.setState(changes);
    return valid;
  };

  handleSubmit = () => {
    const data = {
      username: this.state.username,
      email: this.props.email,
      password: this.props.password,
      passwordRepeat: this.state.passwordRepeat,
    };

    if (this.validate(data) && !this.state.blockers.length) {
      this.props.signUp(data);
    }
  };

  setUsername = username => this.setState({ username });
  setPasswordRepeat = passwordRepeat => this.setState({ passwordRepeat });

  handleForgotPasswordLink = () => {
    this.props.setView(views.FORGOT_PASSWORD);
  };

  handleSignInLink = () => {
    this.props.setView(views.SIGN_IN);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        // allow success UI to be shown for a second, and then close the modal
        this.props.setView(views.SIGN_IN);
      }, 2000);
    }
  }

  render() {
    return (
      <SignUp
        indicateBlocker={this.indicateBlocker}
        indicateBlockerResolved={this.indicateBlockerResolved}
        blocked={!!this.state.blockers.length}
        onSubmit={this.handleSubmit}
        onUsernameChange={this.setUsername}
        onEmailChange={this.props.setEmail}
        onPasswordChange={this.props.setPassword}
        onPasswordRepeatChange={this.setPasswordRepeat}
        onForgotPasswordLink={this.handleForgotPasswordLink}
        onSignInLink={this.handleSignInLink}
        username={this.state.username}
        email={this.props.email}
        password={this.props.password}
        passwordRepeat={this.state.passwordRepeat}
        errorMessage={this.props.errorMessage}
        onRecaptchaVerify={this.handleRecaptchaVerify}
        requireEmailConfirmation={this.props.requireEmailConfirmation}
        loading={this.props.loading}
        success={this.props.success}
        usernameError={this.state.usernameError}
        emailError={this.state.emailError}
        passwordError={this.state.passwordError}
        passwordRepeatError={this.state.passwordRepeatError}
      />
    );
  }
}

SignUpContainer.propTypes = {
  setView: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  requireEmailConfirmation: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  validate: PropTypes.func.isRequired,
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSignUp
)(SignUpContainer);
