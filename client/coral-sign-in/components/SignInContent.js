import React, {PropTypes} from 'react';
import Alert from './Alert';
import {Button, FormField, Spinner, Success} from 'coral-ui';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const SignInContent = ({
  handleChange,
  handleChangeEmail,
  emailToBeResent,
  handleResendVerification,
  emailVerificationLoading,
  emailVerificationSuccess,
  formData,
  ...props
}) => {

  return (
    <div>
      <div className={styles.header}>
        <h1>
          {props.auth.emailVerificationFailure ? lang.t('signIn.emailVerifyCTA') : lang.t('signIn.signIn')}
        </h1>
      </div>
      { props.auth.error && <Alert>{props.auth.error}</Alert> }
      {
        props.auth.emailVerificationFailure
        ? <form onSubmit={handleResendVerification}>
            <p>{lang.t('signIn.requestNewVerifyEmail')}</p>
            <FormField
              id="confirm-email"
              type="email"
              label={lang.t('signIn.email')}
              value={emailToBeResent}
              onChange={handleChangeEmail} />
            <Button id='resendConfirmEmail' type='submit' cStyle='black' full>Send Email</Button>
            {emailVerificationLoading && <Spinner />}
            {emailVerificationSuccess && <Success />}
          </form>
        : <div>
            <div className={styles.socialConnections}>
              <Button cStyle="facebook" onClick={props.fetchSignInFacebook} full>
                {lang.t('signIn.facebookSignIn')}
              </Button>
            </div>
            <div className={styles.separator}>
              <h1>
                {lang.t('signIn.or')}
              </h1>
            </div>
            <form onSubmit={props.handleSignIn}>
              <FormField
                id="email"
                type="email"
                label={lang.t('signIn.email')}
                value={formData.email}
                onChange={handleChange}
              />
              <FormField
                id="password"
                type="password"
                label={lang.t('signIn.password')}
                value={formData.password}
                onChange={handleChange}
              />
              <div className={styles.action}>
                {
                  !props.auth.isLoading ?
                  <Button id='coralLogInButton' type="submit" cStyle="black" className={styles.signInButton} full>
                    {lang.t('signIn.signIn')}
                  </Button>
                  :
                  <Spinner />
                }
              </div>
            </form>
          </div>
      }
      <div className={styles.footer}>
        <span><a onClick={() => props.changeView('FORGOT')}>{lang.t('signIn.forgotYourPass')}</a></span>
        <span>
          {lang.t('signIn.needAnAccount')}
          <a onClick={() => props.changeView('SIGNUP')} id='coralRegister'>
            {lang.t('signIn.register')}
          </a>
        </span>
      </div>
    </div>
  );
};

SignInContent.propTypes = {
  emailVerificationLoading: PropTypes.bool.isRequired,
  emailVerificationSuccess: PropTypes.bool.isRequired,
  handleResendVerification: PropTypes.func.isRequired,
  handleChangeEmail: PropTypes.func.isRequired,
  emailToBeResent: PropTypes.string.isRequired
};

export default SignInContent;
