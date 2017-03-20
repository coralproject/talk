import React from 'react';
import styles from './Logo.css';
import { CoralLogo } from 'coral-ui';

export const Logo = ({ className = '' }) => (
  <div className={`${styles.logo} ${className}`}>
    <h1>
      <CoralLogo className={styles.base} />
      <span>Talk</span>
    </h1>
  </div>
);
