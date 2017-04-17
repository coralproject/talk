import React from 'react';
import {Button} from 'coral-ui';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';

const lang = new I18n(translations);

export default ({status, onClick}) => (
  status === 'open' ? (
    <div className="close-comments-intro-wrapper">
      <p>
        {lang.t('configure.open-stream-configuration')}
      </p>
      <Button onClick={onClick}>{lang.t('configure.close-stream')}</Button>
    </div>
  ) : (
    <div className="close-comments-intro-wrapper">
      <p>
        {lang.t('configure.close-stream-configuration')}
      </p>
      <Button onClick={onClick}>{lang.t('configure.open-stream')}</Button>
    </div>
  )
);
