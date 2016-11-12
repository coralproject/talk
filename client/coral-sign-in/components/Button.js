import React from 'react';
import styles from './styles.css';

const Button = ({type = 'local', children, className, ...props}) => (
  <button
    className={`${styles.button} ${styles[`type--${type}`]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
