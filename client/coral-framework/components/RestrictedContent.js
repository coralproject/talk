import React from 'react';

import t from 'coral-framework/services/i18n';
import RestrictedMessageBox from './RestrictedMessageBox';

export default ({children, restricted, message = t('framework.content_not_available'), restrictedComp}) => {
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
