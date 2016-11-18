import React from 'react';
import styles from './Button.css';

const Button = ({cStyle = 'local', children, className, ...props}) => (
  <button
    className={`${styles.button} ${styles[`type--${cStyle}`]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
