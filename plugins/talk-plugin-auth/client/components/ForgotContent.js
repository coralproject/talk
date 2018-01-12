import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { Button, TextField } from 'plugin-api/beta/client/components/ui';
import t from 'coral-framework/services/i18n';

class ForgotContent extends React.Component {
  state = { value: '' };

  handleSubmit = e => {
    e.preventDefault();
    this.props.fetchForgotPassword(this.state.value);
  };

  handleChangeEmail = e => {
    const { value } = e.target;
    this.setState({ value });
  };

  render() {
    const { changeView, auth } = this.props;
    const { passwordRequestSuccess, passwordRequestFailure } = auth;

    return (
      <div>
        <div className={styles.header}>
          <h1>{t('sign_in.recover_password')}</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.textField}>
            <TextField
              type="email"
              style={{ fontSize: 16 }}
              id="email"
              name="email"
              label={t('sign_in.email')}
              onChange={this.handleChangeEmail}
              value={this.state.value}
            />
          </div>
          <Button
            type="submit"
            cStyle="black"
            className={styles.signInButton}
            full
          >
            {t('sign_in.recover_password')}
          </Button>
          {passwordRequestSuccess ? (
            <p className={styles.passwordRequestSuccess}>
              {passwordRequestSuccess}
            </p>
          ) : null}
          {passwordRequestFailure ? (
            <p className={styles.passwordRequestFailure}>
              {passwordRequestFailure}
            </p>
          ) : null}
        </form>
        <div className={styles.footer}>
          <span>
            {t('sign_in.need_an_account')}{' '}
            <a onClick={() => changeView('SIGNUP')}>{t('sign_in.register')}</a>
          </span>
          <span>
            {t('sign_in.already_have_an_account')}{' '}
            <a onClick={() => changeView('SIGNIN')}>{t('sign_in.sign_in')}</a>
          </span>
        </div>
      </div>
    );
  }
}

ForgotContent.propTypes = {
  auth: PropTypes.object,
  changeView: PropTypes.func,
  fetchForgotPassword: PropTypes.func,
};

export default ForgotContent;
