import React from 'react';
import styles from './Button.css';

const Button = ({cStyle = 'local', children, className, raised = false, full = false, ...props}) => (
  <button
    className={`
      ${styles.button}
      ${styles[`type--${cStyle}`]}
      ${className}
      ${full ? styles.full : ''}
      ${raised ? styles.raised : ''}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
