import React from 'react';
import {Icon} from 'plugin-api/beta/client/components/ui';
import styles from './Tooltip.css';

export default () => (
  <div className={styles.tooltip}>
    <Icon name="info_outline" className={styles.icon} />
    <h3 className={styles.headline}>Featured Comments:</h3>
    <p className={styles.description}>
      Comments selected by our team as worth reading
    </p>
  </div>
);
