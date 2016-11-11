import React, {Component} from 'react';
import {connect} from 'react-redux';

import SignIn from '../components/SignIn';

import {
  loginFacebookCallback,
  loginFacebook,
  logout
} from '../../coral-framework/actions/auth';

class SignInContainer extends Component {
  constructor(props) {
    super(props);

    this.openFacebookWindow = this.openFacebookWindow.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    window.authCallback = loginFacebookCallback;
  }

  openFacebookWindow() {
    this.props.dispatch(loginFacebook());
  }

  logout() {
    this.props.dispatch(logout());
  }

  render() {
    return <SignIn {...this} />;
  }
}

export default connect(({auth}) => ({auth}))(SignInContainer);
