import React from 'react';
import styles from './Tab.css';

export default ({children, tabId, active, onTabClick, cStyle = 'base'}) => (
  <li
    key={tabId}
    className={active ? styles[`${cStyle}--active`] : ''}
    onClick={onTabClick(tabId)}
  >
    {children}
  </li>
);

