import React, {PropTypes} from 'react';
import Alert from './Alert';
import {Button, FormField, Spinner} from 'coral-ui';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const SignInContent = ({
  handleChange,
  handleChangeEmail,
  emailToBeResent,
  handleResendConfirmation,
  formData,
  ...props
}) => {

  return (
    <div>
      <div className={styles.header}>
        <h1>
          {props.auth.emailConfirmationFailure ? lang.t('signIn.emailConfirmCTA') : lang.t('signIn.signIn')}
        </h1>
      </div>
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
      { props.auth.error && <Alert>{props.auth.error}</Alert> }
      {
        props.auth.emailConfirmationFailure
        ? <form onSubmit={handleResendConfirmation}>
          <p>{lang.t('signIn.requestNewConfirmEmail')}</p>
            <FormField
              id="confirm-email"
              type="email"
              label={lang.t('signIn.email')}
              value={emailToBeResent}
              onChange={handleChangeEmail} />
            <Button id='resendConfirmEmail' type='submit' cStyle='black' full>Send Email</Button>
          </form>
        : <form onSubmit={props.handleSignIn}>
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
  handleResendConfirmation: PropTypes.func.isRequired,
  handleChangeEmail: PropTypes.func.isRequired,
  emailToBeResent: PropTypes.string.isRequired
};

export default SignInContent;
