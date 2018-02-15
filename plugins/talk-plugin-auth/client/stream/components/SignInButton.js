import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import styles from './SignInButton.css';

const SignInButton = ({ isLoggedIn, showSignInDialog }) => (
  <div className="talk-stream-auth-sign-in-button">
    {!isLoggedIn ? (
      <Button
        id="coralSignInButton"
        className={styles.button}
        onClick={showSignInDialog}
        full
      >
        {t('talk-plugin-auth.login.sign_in_to_comment')}
      </Button>
    ) : null}
  </div>
);

SignInButton.propTypes = {
  isLoggedIn: PropTypes.bool,
  showSignInDialog: PropTypes.func,
};

export default SignInButton;
