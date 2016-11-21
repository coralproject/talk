import React from 'react';
import FormField from './FormField';
import Alert from './Alert';
import Button from 'coral-ui/components/Button';
import Spinner from 'coral-ui/components/Spinner';
import Success from 'coral-ui/components/Success';
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
    { props.auth.error && <Alert>{props.auth.error}</Alert> }
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
      <FormField
        id="displayName"
        type="text"
        label={lang.t('signIn.displayName')}
        value={formData.displayName}
        showErrors={props.showErrors}
        errorMsg={props.errors.displayName}
        onChange={handleChange}
      />
      <FormField
        id="password"
        type="password"
        label={lang.t('signIn.password')}
        value={formData.password}
        showErrors={props.showErrors}
        errorMsg={props.errors.password}
        onChange={handleChange}
        minLength="8"
      />
      { !props.errors.password && <span className={styles.hint}> Password must be at least 8 characters. </span> }
      <FormField
        id="confirmPassword"
        type="password"
        label={lang.t('signIn.confirmPassword')}
        value={formData.confirmPassword}
        showErrors={props.showErrors}
        errorMsg={props.errors.confirmPassword}
        onChange={handleChange}
        minLength="8"
      />
      <div className={styles.action}>
        { !props.auth.isLoading && !props.auth.successSignUp && (
          <Button type="submit" cStyle="black" id='coralSignUpButton' className={styles.signInButton}>
            {lang.t('signIn.signUp')}
          </Button>
        )}
        { props.auth.isLoading && <Spinner /> }
        { !props.auth.isLoading && props.auth.successSignUp && <Success /> }
      </div>
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
