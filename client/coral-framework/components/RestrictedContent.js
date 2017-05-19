import React from 'react';
import styles from './RestrictedContent.css';

import t from 'coral-framework/services/i18n';

export default ({children, restricted, message = t('framework.content_not_available'), restrictedComp}) => {
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
