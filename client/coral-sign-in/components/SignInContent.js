import React from 'react';
import Button from 'coral-ui/components/Button';
import FormField from './FormField';
import Alert from './Alert';
import Spinner from 'coral-ui/components/Spinner';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const SignInContent = ({handleChange, formData, ...props}) => (
  <div>
    <div className={styles.header}>
      <h1>
        {lang.t('signIn.signIn')}
      </h1>
    </div>
    <div className={styles.socialConnections}>
      <Button cStyle="facebook" onClick={props.fetchSignInFacebook}>
        {lang.t('signIn.facebookSignIn')}
      </Button>
    </div>
    <div className={styles.separator}>
      <h1>
        {lang.t('signIn.or')}
      </h1>
    </div>
    { props.auth.error && <Alert>{props.auth.error}</Alert> }
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
          <Button type="submit" cStyle="black" className={styles.signInButton}>
            {lang.t('signIn.signIn')}
          </Button>
          :
          <Spinner />
        }
      </div>
    </form>
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

export default SignInContent;
