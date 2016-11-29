import React from 'react';
import styles from './Button.css';

const Button = ({cStyle = 'local', children, className, raised, full, ...props}) => (
  <button
    className={`
      ${styles.button}
      ${styles[`type--${cStyle}`]}
      ${className}
      ${full && styles.full}
      ${raised && styles.button}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
