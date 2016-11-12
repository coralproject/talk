import React, {Component} from 'react';
import { Dialog } from 'coral-ui';
import styles from './styles.css';
import Button from './Button';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const SignInDialog = ({open, openFacebookWindow}) => (
  <Dialog
    className={styles.dialog}
    open={open}
  >
    <h1>Sign In</h1>
    <Button type="facebook" onClick={openFacebookWindow}>
      {lang.t('signIn.facebookLogin')}
    </Button>
    <hr/>
      <form>
        <label>
          Email Adress
        <input type="text"/>
        </label>
        <label>
          Password
          <input type="Password"/>
        </label>
        <Button onClick={()=>{}}>
          Sign In
        </Button>
        Forgot Password
        Need an Account? <a>Register</a>
      </form>
  </Dialog>
);

export default SignInDialog;
