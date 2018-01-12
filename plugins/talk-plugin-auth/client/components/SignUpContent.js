import styles from './styles.css';
import React from 'react';
import {
  Button,
  TextField,
  Spinner,
  Success,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import t from 'coral-framework/services/i18n';

class SignUpContent extends React.Component {
  componentWillReceiveProps(next) {
    if (
      !this.props.emailVerificationEnabled &&
      !this.props.auth.successSignUp &&
      next.auth.successSignUp
    ) {
      setTimeout(() => {
        this.props.changeView('SIGNIN');
      }, 2000);
    }
  }

  render() {
    const {
      handleChange,
      formData,
      emailVerificationEnabled,
      auth,
      errors,
      showErrors,
      changeView,
      handleSignUp,
      fetchSignUpFacebook,
    } = this.props;

    return (
      <div>
        <div className={styles.header}>
          <h1>{t('sign_in.sign_up')}</h1>
        </div>

        {auth.error && <Alert>{auth.error}</Alert>}
        {!auth.successSignUp && (
          <div>
            <div className={styles.socialConnections}>
              <Button cStyle="facebook" onClick={fetchSignUpFacebook} full>
                {t('sign_in.facebook_sign_up')}
              </Button>
            </div>
            <div className={styles.separator}>
              <h1>{t('sign_in.or')}</h1>
            </div>
            <form onSubmit={handleSignUp}>
              <TextField
                id="email"
                type="email"
                label={t('sign_in.email')}
                value={formData.email}
                style={{ fontSize: 16 }}
                showErrors={showErrors}
                errorMsg={errors.email}
                onChange={handleChange}
              />
              <TextField
                id="username"
                type="text"
                label={t('sign_in.username')}
                value={formData.username}
                showErrors={showErrors}
                style={{ fontSize: 16 }}
                errorMsg={errors.username}
                onChange={handleChange}
              />
              <TextField
                id="password"
                type="password"
                label={t('sign_in.password')}
                value={formData.password}
                showErrors={showErrors}
                style={{ fontSize: 16 }}
                errorMsg={errors.password}
                onChange={handleChange}
                minLength="8"
              />
              {errors.password && (
                <span className={styles.hint}>
                  {' '}
                  Password must be at least 8 characters.{' '}
                </span>
              )}
              <TextField
                id="confirmPassword"
                type="password"
                label={t('sign_in.confirm_password')}
                value={formData.confirmPassword}
                style={{ fontSize: 16 }}
                showErrors={showErrors}
                errorMsg={errors.confirmPassword}
                onChange={handleChange}
                minLength="8"
              />
              <div className={styles.action}>
                <Button
                  type="submit"
                  cStyle="black"
                  id="coralSignUpButton"
                  className={styles.signInButton}
                  full
                >
                  {t('sign_in.sign_up')}
                </Button>
                {auth.isLoading && <Spinner />}
              </div>
            </form>
          </div>
        )}
        {auth.successSignUp && (
          <div>
            <Success />
            {emailVerificationEnabled && (
              <p>
                {t('sign_in.verify_email')}
                <br />
                <br />
                {t('sign_in.verify_email2')}
              </p>
            )}
          </div>
        )}
        <div className={styles.footer}>
          {t('sign_in.already_have_an_account')}{' '}
          <a id="coralSignInViewTrigger" onClick={() => changeView('SIGNIN')}>
            {t('sign_in.sign_in')}
          </a>
        </div>
      </div>
    );
  }
}

export default SignUpContent;
