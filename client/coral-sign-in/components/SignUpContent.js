import React from 'react';
import FormField from './FormField';
import Alert from './Alert';
import Button from 'coral-ui/components/Button';
import Spinner from 'coral-ui/components/Spinner';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const SignUpContent = ({handleChange, formData, ...props}) => (
  <div>
    <div className={styles.header}>
      <h1>
        {lang.t('signIn.signUp')}
      </h1>
    </div>
    <div className={styles.socialConnections}>
      <Button cStyle="facebook" onClick={props.fetchSignInFacebook}>
        {lang.t('signIn.facebookSignUp')}
      </Button>
    </div>
    <div className={styles.separator}>
      <h1>
        {lang.t('signIn.or')}
      </h1>
    </div>
    { props.auth.signUpError && <Alert>{props.auth.signUpError}</Alert> }
    <form onSubmit={props.handleSignUp}>
      <FormField
        id="email"
        type="email"
        label={lang.t('signIn.email')}
        value={formData.email}
        showErrors={props.showErrors}
        errorMsg={props.errors.email}
        onChange={handleChange}
      />
      { !props.auth.emailAvailable && <Alert>This email is not available.</Alert> }
      <FormField
        id="username"
        type="text"
        label={lang.t('signIn.username')}
        value={formData.username}
        showErrors={props.showErrors}
        errorMsg={props.errors.username}
        onChange={handleChange}
      />
      { !props.auth.displayNameAvailable && <Alert>This username is not available.</Alert> }
      <FormField
        id="password"
        type="password"
        label={lang.t('signIn.password')}
        value={formData.password}
        showErrors={props.showErrors}
        errorMsg={props.errors.password}
        onChange={handleChange}
      />
      <FormField
        id="confirmPassword"
        type="password"
        label={lang.t('signIn.confirmPassword')}
        value={formData.confirmPassword}
        showErrors={props.showErrors}
        errorMsg={props.errors.confirmPassword}
        onChange={handleChange}
      />
      {
        !props.auth.isLoading ?
          <Button type="submit" cStyle="black" className={styles.signInButton}>
            {lang.t('signIn.signUp')}
          </Button>
          :
          <Spinner />
      }
    </form>
    <div className={styles.footer}>
      <span>
        {lang.t('signIn.alreadyHaveAnAccount')}
        <a onClick={() => props.changeView('SIGNIN')}>
          {lang.t('signIn.signIn')}
        </a>
      </span>
    </div>
  </div>
);

export default SignUpContent;
