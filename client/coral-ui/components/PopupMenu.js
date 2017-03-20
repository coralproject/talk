import React from 'react';
import styles from './PopupMenu.css';

export default ({ children }) => (
  <span className={styles.popupMenu}>{children}</span>
);
