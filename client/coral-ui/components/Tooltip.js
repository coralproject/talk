import React from 'react';
import styles from './Tooltip.css';

export default ({ children }) => (
  <span className={styles.tooltip}>{children}</span>
);
