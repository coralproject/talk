import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withForgotPassword } from 'coral-framework/hocs';
import { compose } from 'recompose';
import ForgotPassword from '../components/ForgotPassword';

class ForgotPasswordContainer extends Component {
  state = {
    email: '',
  };

  handleSubmit = () => {
    this.props.forgotPassword(this.state.email);
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  render() {
    return (
      <ForgotPassword
        onSubmit={this.handleSubmit}
        onEmailChange={this.handleEmailChange}
        email={this.state.email}
        errorMessage={this.props.errorMessage}
        success={this.props.success}
        onSignInLink={this.props.onSignInLink}
      />
    );
  }
}

ForgotPasswordContainer.propTypes = {
  success: PropTypes.bool.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  onSignInLink: PropTypes.func.isRequired,
};

export default compose(withForgotPassword)(ForgotPasswordContainer);
