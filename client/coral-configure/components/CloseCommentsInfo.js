import React from 'react';
import {Button} from 'coral-ui';

import t from 'coral-framework/services/i18n';

export default ({status, onClick}) => (
  status === 'open' ? (
    <div className="close-comments-intro-wrapper">
      <p>
        {t('configure.open_stream_configuration')}
      </p>
      <Button onClick={onClick}>{t('configure.close_stream')}</Button>
    </div>
  ) : (
    <div className="close-comments-intro-wrapper">
      <p>
        {t('configure.close_stream_configuration')}
      </p>
      <Button onClick={onClick}>{t('configure.open_stream')}</Button>
    </div>
  )
);
