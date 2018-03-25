import React from 'react';
import styles from './Forbidden.css';

const Forbidden = () => (
  <div className={styles.container}>
    <p className={styles.copy}>
      This page is for team use only. Please contact an administrator if you
      want to join this team.
    </p>
  </div>
);

export default Forbidden;
