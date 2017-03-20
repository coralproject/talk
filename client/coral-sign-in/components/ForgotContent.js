import React from 'react';
import styles from './styles.css';
import Button from 'coral-ui/components/Button';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

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
    const { changeView, auth } = this.props;
    const { passwordRequestSuccess, passwordRequestFailure } = auth;

    return (
      <div>
        <div className={styles.header}>
          <h1>{lang.t('signIn.recoverPassword')}</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.textField}>
            <label htmlFor="email">{lang.t('signIn.email')}</label>
            <input
              ref={input => this.emailInput = input}
              type="text"
              id="email"
              name="email" />
          </div>
          <Button type="submit" cStyle="black" className={styles.signInButton} full>
            {lang.t('signIn.recoverPassword')}
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
          <span>{lang.t('signIn.needAnAccount')} <a onClick={() => changeView('SIGNUP')}>{lang.t('signIn.register')}</a></span>
          <span>{lang.t('signIn.alreadyHaveAnAccount')} <a onClick={() => changeView('SIGNIN')}>{lang.t('signIn.signIn')}</a></span>
        </div>
      </div>
    );
  }
}

export default ForgotContent;
