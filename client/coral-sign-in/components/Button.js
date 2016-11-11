import React from 'react';
import styles from './styles.css';

const Button = ({type = 'local', children, ...props}) => (
  <button
    className={`${styles.button} ${styles[type]}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
