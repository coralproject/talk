import React from 'react';
import {Button} from 'coral-ui';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showSignInDialog} from 'coral-framework/actions/auth';

const SignInButton = ({loggedIn, showSignInDialog}) => (
  <div>
    {
      !loggedIn ? (
        <Button id="coralSignInButton" onClick={showSignInDialog} full>
          Sign in to comment
        </Button>
      ) : null
    }
  </div>
);

const mapStateToProps = ({auth}) => ({
  loggedIn: auth.toJS().loggedIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({showSignInDialog}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);
