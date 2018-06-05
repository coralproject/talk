import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, withForgotPassword } from 'plugin-api/beta/client/hocs';
import { compose } from 'recompose';
import ForgotPassword from '../components/ForgotPassword';
import { bindActionCreators } from 'redux';
import * as views from '../enums/views';
import { setView, setEmail } from '../actions';

class ForgotPasswordContainer extends Component {
  handleSubmit = () => {
    this.props.forgotPassword(this.props.email);
  };

  handleSignUpLink = () => {
    this.props.setView(views.SIGN_UP);
  };

  handleSignInLink = () => {
    this.props.setView(views.SIGN_IN);
  };

  render() {
    return (
      <ForgotPassword
        onSubmit={this.handleSubmit}
        onEmailChange={this.props.setEmail}
        email={this.props.email}
        errorMessage={this.props.errorMessage}
        success={this.props.success}
        onSignInLink={this.handleSignInLink}
        onSignUpLink={this.handleSignUpLink}
      />
    );
  }
}

ForgotPasswordContainer.propTypes = {
  success: PropTypes.bool.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setView: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};

const mapStateToProps = ({ talkPluginAuth: state }) => ({
  email: state.email,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setView,
      setEmail,
    },
    dispatch
  );

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withForgotPassword
)(ForgotPasswordContainer);
