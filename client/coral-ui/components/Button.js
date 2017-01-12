import React from 'react';
import styles from './Button.css';
import Icon from './Icon';

const Button = ({cStyle = 'local', children, className, raised = false, full = false, icon = '', ...props}) => (
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
    {icon && <Icon name={icon} />}
    {children}
  </button>
);

export default Button;
