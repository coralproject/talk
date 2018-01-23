import React from 'react';
import styles from './Spinner.css';

const Spinner = () => (
  <div className={styles.container}>
    <svg
      className={styles.spinner}
      width="40px"
      height="40px"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles.path}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  </div>
);

export default Spinner;
