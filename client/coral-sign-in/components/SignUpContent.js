import React from 'react';
import styles from './styles.css';
import Button from './Button';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const SignUpContent = ({goTo, openFacebookWindow}) => (
  <div>
    <div className={styles.header}>
      <h1>{lang.t('signIn.signUp')}</h1>
    </div>
    <div className={styles.socialConnections}>
      <Button type="facebook" onClick={openFacebookWindow}>
        {lang.t('signIn.facebookSignUp')}
      </Button>
    </div>
    <div className={styles.separator}>
      <h1>{lang.t('signIn.or')}</h1>
    </div>
    <form>
      <div className={styles.formField}>
        <label htmlFor="email">{lang.t('signIn.email')}</label>
        <input type="text" id="email" />
      </div>
      <div className={styles.formField}>
        <label htmlFor="username">{lang.t('signIn.username')}</label>
        <input type="text" id="username" />
      </div>
      <div className={styles.formField}>
        <label htmlFor="password">{lang.t('signIn.password')}</label>
        <input type="password" id="password" />
      </div>
      <div className={styles.formField}>
        <label htmlFor="confirmPassword">{lang.t('signIn.confirmPassword')}</label>
        <input type="password" id="confirmPassword" />
      </div>
      <Button type="black" className={styles.signInButton} onClick={()=>{}}>
        {lang.t('signIn.signIn')}
      </Button>
    </form>
    <div className={styles.footer}>
      <span>{lang.t('signIn.alreadyHaveAnAccount')} <a onClick={() => goTo(1)}>{lang.t('signIn.signIn')}</a></span>
    </div>
  </div>
);

export default SignUpContent;
