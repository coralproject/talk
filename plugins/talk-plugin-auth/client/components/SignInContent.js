import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Spinner,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import styles from './styles.css';
import t from 'coral-framework/services/i18n';

const SignInContent = ({
  handleChange,
  formData,
  changeView,
  handleSignIn,
  auth,
  fetchSignInFacebook,
}) => {
  return (
    <div className="coral-sign-in">
      <div className={`${styles.header} header`}>
        <h1>{t('sign_in.sign_in_to_join')}</h1>
      </div>
      {auth.error && (
        <Alert>
          {auth.error.translation_key
            ? t(`error.${auth.error.translation_key}`)
            : auth.error.toString()}
        </Alert>
      )}
      <div>
        <div className={`${styles.socialConnections} social-connections`}>
          <Button cStyle="facebook" onClick={fetchSignInFacebook} full>
            {t('sign_in.facebook_sign_in')}
          </Button>
        </div>
        <div className={styles.separator}>
          <h1>{t('sign_in.or')}</h1>
        </div>
        <form onSubmit={handleSignIn}>
          <TextField
            id="email"
            type="email"
            label={t('sign_in.email')}
            value={formData.email}
            style={{ fontSize: 16 }}
            onChange={handleChange}
          />
          <TextField
            id="password"
            type="password"
            label={t('sign_in.password')}
            value={formData.password}
            style={{ fontSize: 16 }}
            onChange={handleChange}
          />
          <div className={styles.action}>
            {!auth.isLoading ? (
              <Button
                id="coralLogInButton"
                type="submit"
                cStyle="black"
                className={styles.signInButton}
                full
              >
                {t('sign_in.sign_in')}
              </Button>
            ) : (
              <Spinner />
            )}
          </div>
        </form>
      </div>
      <div className={`${styles.footer} footer`}>
        <span>
          <a onClick={() => changeView('FORGOT')}>
            {t('sign_in.forgot_your_pass')}
          </a>
        </span>
        <span>
          {t('sign_in.need_an_account')}
          <a onClick={() => changeView('SIGNUP')} id="coralRegister">
            {t('sign_in.register')}
          </a>
        </span>
      </div>
    </div>
  );
};

SignInContent.propTypes = {
  auth: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    emailVerificationFailure: PropTypes.bool,
  }).isRequired,
  fetchSignInFacebook: PropTypes.func.isRequired,
  handleSignIn: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  emailVerificationLoading: PropTypes.bool.isRequired,
  emailVerificationSuccess: PropTypes.bool.isRequired,
  resendVerification: PropTypes.func.isRequired,
  formData: PropTypes.object,
};

export default SignInContent;
