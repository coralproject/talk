import React from 'react';
import FacebookButton from '../containers/FacebookButton';
import { t } from 'plugin-api/beta/client/services';

export default () => {
  return (
    <FacebookButton>{t('talk-plugin-facebook-auth.sign_up')}</FacebookButton>
  );
};
