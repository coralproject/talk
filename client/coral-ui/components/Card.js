import React from 'react';
import styles from './Card.css';

export default ({children, className, shadow = 2, ...props}) => (
  <div className={`${styles.base} ${className} ${styles[`shadow--${shadow}`]}`} {...props}>
    {children}
  </div>
);
