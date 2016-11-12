import React from 'react';
import Button from './Button';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';

const lang = new I18n(translations);

const SignIn = ({openFacebookWindow, logout}) => (
  <div>
    <Button type="facebook" onClick={openFacebookWindow}>
      {lang.t('signIn.facebookLogin')}
    </Button>
    <a onClick={logout}>
      {lang.t('signIn.logout')}
    </a>
  </div>
);

export default SignIn;
