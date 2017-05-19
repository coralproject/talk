import React from 'react';

import RestrictedMessageBox from './RestrictedMessageBox';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);

export default ({children, restricted, message = lang.t('contentNotAvailable'), restrictedComp}) => {
  if (restricted) {
    return restrictedComp ? restrictedComp : <RestrictedMessageBox message={message} />;
  } else {
    return (
      <div>
        {children}
      </div>
    );
  }
};

