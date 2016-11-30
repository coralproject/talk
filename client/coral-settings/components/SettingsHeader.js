import React from 'react';
import styles from './SettingsHeader.css';

export default ({user}) => (
  <div className={styles.header}>
    <h1>{user.displayName}</h1>
    <h2>{user.profiles.map(profile => profile.id)}</h2>
  </div>
);

