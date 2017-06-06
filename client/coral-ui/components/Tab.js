import React from 'react';
import styles from './Tab.css';

export default ({children, tabId, active, onTabClick, cStyle = 'base', ...props}) => (
  <li
    key={tabId}
    className={`${active ? `${styles[`${cStyle}--active`]} tab-active` : ''} tab ${props.className}`}
    onClick={() => onTabClick(tabId)}
  >
    {children}
  </li>
);
