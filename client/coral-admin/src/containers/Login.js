import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withLogin } from 'coral-framework/hocs';
import { compose } from 'recompose';
import Login from '../components/Login';

class LoginContainer extends Component {
  state = {
    email: '',
    password: '',
  };

  handleSubmit = () => {
    this.props.login(this.state.email, this.state.password);
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  render() {
    return (
      <Login
        onSubmit={this.handleSubmit}
        onEmailChange={this.handleEmailChange}
        onPasswordChange={this.handlePasswordChange}
        email={this.state.email}
        password={this.state.password}
        errorMessage={this.props.errorMessage}
      />
    );
  }
}

LoginContainer.propTypes = {
  login: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default compose(withLogin)(LoginContainer);
