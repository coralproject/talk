import React from 'react';
import {
  Button,
  Spinner,
  Success,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import PropTypes from 'prop-types';
import styles from './ResendEmailConfirmation.css';
import t from 'coral-framework/services/i18n';

class ResendVerification extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { email, errorMessage, loading, success } = this.props;
    return (
      <div className="talk-resend-verification">
        <h1 className={styles.header}>{t('sign_in.email_verify_cta')}</h1>

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
                {t('sign_in.request_new_verify_email')}
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
  errorMessage: PropTypes.string.isRequired,
};

export default ResendVerification;
