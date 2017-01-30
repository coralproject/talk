import React from 'react';
import styles from './SnackBar.css';

const SnackBar = ({children, className, position, ...attrs}) => {
  return (
    <div className={`${styles.SnackBar} ${className}`} style={{top: `${position}px`}} {...attrs} >
     {children}
     </div>
  );
};

export default SnackBar;
