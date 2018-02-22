import React from 'react';
import {
  Button,
  Spinner,
  Success,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import PropTypes from 'prop-types';
import styles from './ResendEmailConfirmation.css';

class ResendVerification extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { email, errorMessage, loading, success } = this.props;
    return (
      <div className="talk-resend-verification">
        <h1 className={styles.header}>
          {t('talk-plugin-auth.login.email_verify_cta')}
        </h1>

        {errorMessage && <Alert>{errorMessage}</Alert>}
        <div className={styles.notVerified}>
          {t('error.email_not_verified', email)}
        </div>
        <div>
          {!loading &&
            !success && (
              <Button
                id="resendConfirmEmail"
                cStyle="black"
                onClick={this.handleSubmit}
                full
              >
                {t('talk-plugin-auth.login.request_new_verify_email')}
              </Button>
            )}
          {loading && <Spinner />}
          {success && <Success />}
        </div>
      </div>
    );
  }
}

ResendVerification.propTypes = {
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default ResendVerification;
