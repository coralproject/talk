import React from 'react';
import styles from './SnackBar.css';

const SnackBar = ({ children, className, position, ...attrs }) => {
  return (
    <div
      className={`${styles.SnackBar} ${className}`}
      style={position ? { top: `${position}px` } : fixedStyle}
      {...attrs}
    >
      {children}
    </div>
  );
};

const fixedStyle = { bottom: '200px', top: 'auto' };

export default SnackBar;
