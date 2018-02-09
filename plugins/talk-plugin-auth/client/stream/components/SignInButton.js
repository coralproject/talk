import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'plugin-api/beta/client/components/ui';
import t from 'coral-framework/services/i18n';

const SignInButton = ({ currentUser, showSignInDialog }) => (
  <div className="talk-stream-auth-sign-in-button">
    {!currentUser ? (
      <Button id="coralSignInButton" onClick={showSignInDialog} full>
        {t('sign_in.sign_in_to_comment')}
      </Button>
    ) : null}
  </div>
);

SignInButton.propTypes = {
  currentUser: PropTypes.object,
  showSignInDialog: PropTypes.func,
};

export default SignInButton;
