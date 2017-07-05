import React from 'react';
import {Button} from 'plugin-api/beta/client/components/ui';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showSignInDialog} from 'coral-framework/actions/auth';
import t from 'coral-framework/services/i18n';

const SignInButton = ({loggedIn, showSignInDialog}) => (
  <div>
    {!loggedIn
      ? <Button id="coralSignInButton" onClick={showSignInDialog} full>
          {t('sign_in.sign_in_to_comment')}
        </Button>
      : null}
  </div>
);

const mapStateToProps = ({auth}) => ({
  loggedIn: auth.toJS().loggedIn
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({showSignInDialog}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);
