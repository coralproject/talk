import React from 'react';
import styles from './styles.css';

const Alert = ({cStyle = 'error', children, className, ...props}) => (
  <div
    className={`${styles.alert} ${styles[`alert--${cStyle}`]} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Alert;
