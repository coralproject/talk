import styles from './styles.css';
import React from 'react';
import translations from '../translations';
import I18n from 'coral-framework/modules/i18n/i18n';
import {Button, TextField, Spinner, Success, Alert} from 'coral-ui';

const lang = new I18n(translations);

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
      fetchSignUpFacebook
    } = this.props;

    return (
      <div>
        <div className={styles.header}>
          <h1>
            {lang.t('signIn.signUp')}
          </h1>
        </div>

        {auth.error && <Alert>{auth.error}</Alert>}
        {!auth.successSignUp &&
          <div>
            <div className={styles.socialConnections}>
              <Button cStyle="facebook" onClick={fetchSignUpFacebook} full>
                {lang.t('signIn.facebookSignUp')}
              </Button>
            </div>
            <div className={styles.separator}>
              <h1>
                {lang.t('signIn.or')}
              </h1>
            </div>
            <form onSubmit={handleSignUp}>
              <TextField
                id="email"
                type="email"
                label={lang.t('signIn.email')}
                value={formData.email}
                style={{fontSize: 16}}
                showErrors={showErrors}
                errorMsg={errors.email}
                onChange={handleChange}
              />
              <TextField
                id="username"
                type="text"
                label={lang.t('signIn.username')}
                value={formData.username}
                showErrors={showErrors}
                style={{fontSize: 16}}
                errorMsg={errors.username}
                onChange={handleChange}
              />
              <TextField
                id="password"
                type="password"
                label={lang.t('signIn.password')}
                value={formData.password}
                showErrors={showErrors}
                style={{fontSize: 16}}
                errorMsg={errors.password}
                onChange={handleChange}
                minLength="8"
              />
              {errors.password &&
                <span className={styles.hint}>
                  {' '}Password must be at least 8 characters.{' '}
                </span>}
              <TextField
                id="confirmPassword"
                type="password"
                label={lang.t('signIn.confirmPassword')}
                value={formData.confirmPassword}
                style={{fontSize: 16}}
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
                  {lang.t('signIn.signUp')}
                </Button>
                {auth.isLoading && <Spinner />}
              </div>
            </form>
          </div>}
        {auth.successSignUp &&
          <div>
            <Success />
            {emailVerificationEnabled &&
              <p>
                {lang.t('signIn.verifyEmail')}
                <br />
                <br />
                {lang.t('signIn.verifyEmail2')}
              </p>}
          </div>}
        <div className={styles.footer}>
          {lang.t('signIn.alreadyHaveAnAccount')} <a
            id="coralSignInViewTrigger"
            onClick={() => changeView('SIGNIN')}
          >
            {lang.t('signIn.signIn')}
          </a>
        </div>
      </div>
    );
  }
}

export default SignUpContent;
