import React from 'react';
import styles from './Tab.css';

export default ({children, tabId, active, onTabClick, cStyle = 'base', cNames}) => (
  <li
    key={tabId}
    className={`${active ? styles[`${cStyle}--active`] : ''} tab ${cNames ? cNames : ''}`}
    onClick={() => onTabClick(tabId)}
  >
    {children}
  </li>
);

