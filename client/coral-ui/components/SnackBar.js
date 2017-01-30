import React from 'react';
import styles from './SnackBar.css'

const SnackBar = ({children}) => (
  <div className={styles.SnackBar}>{children}</div>
);

export default SnackBar;
