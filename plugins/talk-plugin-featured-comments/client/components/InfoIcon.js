import React from 'react';
import styles from './InfoIcon.css';
import {Icon} from 'plugin-api/beta/client/components/ui';

export default () => (
  <Icon 
    name="info_outline"
    className={styles.infoIcon}
  />
);