import React from 'react';
import styles from './styles.css';
import Button from 'coral-ui/components/Button';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const ForgotContent = ({changeView, ...props}) => (
  <div>
    <div className={styles.header}>
      <h1>{lang.t('signIn.recoverPassword')}</h1>
    </div>
    <form onSubmit={(e) => {e.preventDefault(); props.fetchForgotPassword();}}>
      <div className={styles.formField}>
        <label htmlFor="email">{lang.t('signIn.email')}</label>
        <input type="text" id="email" />
      </div>
      <Button type="submit" cStyle="black" className={styles.signInButton}>
        {lang.t('signIn.recoverPassword')}
      </Button>
    </form>
    <div className={styles.footer}>
      <span>{lang.t('signIn.needAnAccount')} <a onClick={() => changeView('SIGNUP')}>{lang.t('signIn.register')}</a></span>
      <span>{lang.t('signIn.alreadyHaveAnAccount')} <a onClick={() => changeView('SIGNIN')}>{lang.t('signIn.signIn')}</a></span>
    </div>
  </div>
);

export default ForgotContent;
