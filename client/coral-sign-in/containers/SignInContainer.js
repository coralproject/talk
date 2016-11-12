import React, {Component} from 'react';
import {connect} from 'react-redux';

import SignDialog from '../components/SignDialog';
import Button from '../components/Button';

import {
  loginFacebookCallback,
  loginFacebook,
  logout,
  showSignInDialog,
  goTo,
} from '../../coral-framework/actions/auth';

class SignInContainer extends Component {
  constructor(props) {
    super(props);

    this.openFacebookWindow = this.openFacebookWindow.bind(this);
    this.openSignInDialog = this.openSignInDialog.bind(this);
    this.logout = this.logout.bind(this);
    this.goTo = this.goTo.bind(this);
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

  goTo(step = 1) {
    this.props.dispatch(goTo(step));
  }

  render() {
    const {auth} = this.props;
    return (
      <div>
        <Button onClick={this.openSignInDialog}>
          Sign in to comment
        </Button>
        <SignDialog
          openFacebookWindow={this.openFacebookWindow}
          open={auth.get('showSignInDialog')}
          step={auth.get('step')}
          goTo={this.goTo}
        />
      </div>
    );
  }
}

export default connect(({auth}) => ({auth}))(SignInContainer);
