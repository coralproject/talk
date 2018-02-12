import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Spinner,
  Success,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import t from 'coral-framework/services/i18n';
import styles from './SignUp.css';

class SignUp extends React.Component {
  handleSignInLink = e => {
    e.preventDefault();
    this.props.onSignInLink();
  };

  handleUsernameChange = e => this.props.onUsernameChange(e.target.value);
  handleEmailChange = e => this.props.onEmailChange(e.target.value);
  handlePasswordChange = e => this.props.onPasswordChange(e.target.value);
  handlePasswordRepeatChange = e =>
    this.props.onPasswordRepeatChange(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const {
      username,
      email,
      password,
      passwordRepeat,
      usernameError,
      emailError,
      passwordError,
      passwordRepeatError,
      loading,
      errorMessage,
      requireEmailConfirmation,
      success,
    } = this.props;

    return (
      <div>
        <div className={styles.header}>
          <h1>{t('sign_in.sign_up')}</h1>
        </div>

        {errorMessage && <Alert>{errorMessage}</Alert>}
        {!success && (
          <div>
            <div className={styles.socialConnections}>Social</div>
            <div className={styles.separator}>
              <h1>{t('sign_in.or')}</h1>
            </div>
            <form onSubmit={this.handleSubmit}>
              <TextField
                id="email"
                type="email"
                label={t('sign_in.email')}
                value={email}
                style={{ fontSize: 16 }}
                showErrors={!!emailError}
                errorMsg={emailError}
                onChange={this.handleEmailChange}
              />
              <TextField
                id="username"
                type="text"
                label={t('sign_in.username')}
                value={username}
                style={{ fontSize: 16 }}
                showErrors={!!usernameError}
                errorMsg={usernameError}
                onChange={this.handleUsernameChange}
              />
              <TextField
                id="password"
                type="password"
                label={t('sign_in.password')}
                value={password}
                style={{ fontSize: 16 }}
                showErrors={!!passwordError}
                errorMsg={passwordError}
                onChange={this.handlePasswordChange}
                minLength="8"
              />
              {passwordError && (
                <span className={styles.hint}>
                  {' '}
                  Password must be at least 8 characters.{' '}
                </span>
              )}
              <TextField
                id="confirmPassword"
                type="password"
                label={t('sign_in.confirm_password')}
                value={passwordRepeat}
                style={{ fontSize: 16 }}
                showErrors={!!passwordRepeatError}
                errorMsg={passwordRepeatError}
                onChange={this.handlePasswordRepeatChange}
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
                {loading && <Spinner />}
              </div>
            </form>
          </div>
        )}
        {success && (
          <div>
            <Success />
            {requireEmailConfirmation && (
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
          <a id="coralSignInViewTrigger" onClick={this.handleSignInLink}>
            {t('sign_in.sign_in')}
          </a>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  loading: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  usernameError: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordError: PropTypes.string.isRequired,
  passwordRepeat: PropTypes.string.isRequired,
  passwordRepeatError: PropTypes.string.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onPasswordRepeatChange: PropTypes.func.isRequired,
  onSignInLink: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  requireEmailConfirmation: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
};

export default SignUp;
