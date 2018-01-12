import React from 'react';
import styles from './PopupMenu.css';

export default ({ children }) => (
  <div className={styles.popupMenu}>{children}</div>
);
