import React, {Component} from 'react';
import {connect} from 'react-redux';

import SignIn from '../components/SignIn';
import SignInDialog from '../components/SignInDialog';
import Button from '../components/Button';

import {
  loginFacebookCallback,
  loginFacebook,
  logout,
  showSignInDialog
} from '../../coral-framework/actions/auth';

class SignInContainer extends Component {
  constructor(props) {
    super(props);

    this.openFacebookWindow = this.openFacebookWindow.bind(this);
    this.openSignInDialog = this.openSignInDialog.bind(this);
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

  openSignInDialog() {
    this.props.dispatch(showSignInDialog());
  }

  render() {
    const {auth} = this.props;
    return (
      <div>
        <Button onClick={this.openSignInDialog}>
          Sign in to comment
        </Button>
        <SignInDialog
          openFacebookWindow={this.openFacebookWindow}
          open={auth.get('showSignInDialog')}
        />
      </div>
    );
  }
}

export default connect(({auth}) => ({auth}))(SignInContainer);
