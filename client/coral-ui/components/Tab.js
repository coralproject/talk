import React from 'react';
import styles from './Tab.css';

export default ({children, tabId, active, onTabClick}) => (
  <li
    key={tabId}
    className={`${styles.base} ${active && styles.active}`}
    onClick={onTabClick}
  >
    {children}
    </li>
);

