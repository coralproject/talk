import React from 'react';
import {
  Button,
  Spinner,
  Success,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import PropTypes from 'prop-types';
import styles from './ResendVerification.css';
import t from 'coral-framework/services/i18n';

class ResendVerification extends React.Component {
  render() {
    const { resendVerification, error, loading, success, email } = this.props;
    return (
      <div className="talk-resend-verification">
        <h1 className={styles.header}>{t('sign_in.email_verify_cta')}</h1>

        {error && (
          <Alert>
            {error.translation_key
              ? t(`error.${error.translation_key}`)
              : error.toString()}
          </Alert>
        )}
        <div className={styles.notVerified}>
          {t('error.email_not_verified', email)}
        </div>
        <div>
          <Button
            id="resendConfirmEmail"
            cStyle="black"
            onClick={resendVerification}
            full
          >
            {t('sign_in.request_new_verify_email')}
          </Button>
          {loading && <Spinner />}
          {success && <Success />}
        </div>
      </div>
    );
  }
}

ResendVerification.propTypes = {
  resendVerification: PropTypes.bool.isRequired,
  error: PropTypes.object,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  email: PropTypes.string.isRequired,
};

export default ResendVerification;
