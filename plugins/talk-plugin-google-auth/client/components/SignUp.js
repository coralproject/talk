import React from 'react';
import GoogleButton from '../containers/GoogleButton';
import { t } from 'plugin-api/beta/client/services';

export default () => {
  return <GoogleButton>{t('talk-plugin-google-auth.sign_up')}</GoogleButton>;
};
