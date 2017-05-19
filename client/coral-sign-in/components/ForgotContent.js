import React from 'react';
import styles from './styles.css';
import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

class ForgotContent extends React.Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.fetchForgotPassword(this.emailInput.value);
  }

  render () {
    const {changeView, auth} = this.props;
    const {passwordRequestSuccess, passwordRequestFailure} = auth;

    return (
      <div>
        <div className={styles.header}>
          <h1>{t('sign_in.recover_password')}</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.textField}>
            <label htmlFor="email">{t('sign_in.email')}</label>
            <input
              ref={(input) => this.emailInput = input}
              type="text"
              style={{fontSize: 16}}
              id="email"
              name="email" />
          </div>
          <Button type="submit" cStyle="black" className={styles.signInButton} full>
            {t('sign_in.recover_password')}
          </Button>
          {
            passwordRequestSuccess
            ? <p className={styles.passwordRequestSuccess}>{passwordRequestSuccess}</p>
            : null
          }
          {
            passwordRequestFailure
            ? <p className={styles.passwordRequestFailure}>{passwordRequestFailure}</p>
            : null
          }
        </form>
        <div className={styles.footer}>
          <span>{t('sign_in.need_an_account')} <a onClick={() => changeView('SIGNUP')}>{t('sign_in.register')}</a></span>
          <span>{t('sign_in.already_have_an_account')} <a onClick={() => changeView('SIGNIN')}>{t('sign_in.sign_in')}</a></span>
        </div>
      </div>
    );
  }
}

export default ForgotContent;
