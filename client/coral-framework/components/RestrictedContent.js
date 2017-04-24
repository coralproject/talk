import React from 'react';
import styles from './RestrictedContent.css';

import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

export default ({children, restricted, message = lang.t('contentNotAvailable'), restrictedComp}) => {
  if (restricted) {
    return restrictedComp ? restrictedComp : messageBox(message);
  } else {
    return (
      <div>
        {children}
      </div>
    );
  }
};

const messageBox = (message) => <div className={styles.message}>{message}</div>;
