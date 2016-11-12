import React, {Component} from 'react';
import {connect} from 'react-redux';

import SignDialog from '../components/SignDialog';
import Button from '../components/Button';

import {
  loginFacebookCallback,
  loginFacebook,
  logout,
  showSignInDialog,
  changeView,
  hideSignInDialog
} from '../../coral-framework/actions/auth';

class SignInContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.authCallback = this.props.loginFacebookCallback;
  }

  render() {
    const {auth, showSignInDialog} = this.props;
    return (
      <div>
        <Button onClick={showSignInDialog}>
          Sign in to comment
        </Button>
        <SignDialog
          open={auth.get('showSignInDialog')}
          view={auth.get('view')}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => ({auth});

const mapDispatchToProps = dispatch => ({
  loginFacebookCallback: () => dispatch(loginFacebookCallback()),
  loginFacebook: () => dispatch(loginFacebook()),
  logout: () => dispatch(logout()),
  showSignInDialog: () => dispatch(showSignInDialog()),
  changeView: (view) => dispatch(changeView(view)),
  onClose: () => dispatch(hideSignInDialog())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
