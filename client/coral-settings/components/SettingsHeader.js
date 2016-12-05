import React from 'react';
import styles from './SettingsHeader.css';

export default ({userData}) => (
  <div className={styles.header}>
    <h1>{userData.displayName}</h1>
    <h2>{userData.profiles.map(profile => profile.id)}</h2>
  </div>
);

