import React from 'react';
import cn from 'classnames';
import styles from './Tooltip.css';
import {t} from 'plugin-api/beta/client/services';

export default ({className = '', children}) => (
  <div className={cn(styles.tooltip, className)}>
    <h3 className={styles.headline}>
      {t('talk-plugin-moderation-actions.moderation_actions')}
    </h3>
    {children}
  </div>
);
