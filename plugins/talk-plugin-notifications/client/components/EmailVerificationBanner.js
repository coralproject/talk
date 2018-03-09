import React from 'react';
import Banner from './Banner';
import PropTypes from 'prop-types';
import { Spinner } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import styles from './EmailVerificationBanner.css';

const EmailVerificationBannerInfo = ({ onResendEmailVerification }) => (
  <Banner icon="email" title={t('talk-plugin-notifications.banner_info.title')}>
    <p>
      {t('talk-plugin-notifications.banner_info.text')}
      <a
        className={styles.link}
        onClick={() => {
          onResendEmailVerification();
          return false;
        }}
      >
        {t('talk-plugin-notifications.banner_info.verify_now')}
      </a>
    </p>
  </Banner>
);

const EmailVerificationBannerLoading = () => (
  <Banner icon="email" title={t('talk-plugin-notifications.banner_info.title')}>
    <Spinner className={styles.spinner} />
  </Banner>
);

const EmailVerificationBannerError = ({ errorMessage }) => (
  <Banner title={t('talk-plugin-notifications.banner_error.title')} error>
    <p>{t('talk-plugin-notifications.banner_error.text')}</p>
    <p>{errorMessage}</p>
  </Banner>
);

const EmailVerificationBannerSuccess = ({ email }) => (
  <Banner title={t('talk-plugin-notifications.banner_success.title')} success>
    <p>{t('talk-plugin-notifications.banner_success.text', email)}</p>
  </Banner>
);

const EmailVerificationBanner = ({
  onResendEmailVerification,
  email,
  success,
  loading,
  errorMessage,
}) => (
  <div>
    {success && <EmailVerificationBannerSuccess email={email} />}
    {errorMessage && (
      <EmailVerificationBannerError errorMessage={errorMessage} />
    )}
    {loading && <EmailVerificationBannerLoading />}
    {!success &&
      !errorMessage &&
      !loading && (
        <EmailVerificationBannerInfo
          onResendEmailVerification={onResendEmailVerification}
        />
      )}
  </div>
);

EmailVerificationBanner.propTypes = {
  onResendEmailVerification: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
};

export default EmailVerificationBanner;
