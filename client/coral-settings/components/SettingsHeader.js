import React from 'react';
import styles from './SettingsHeader.css';

export default ({userData}) => (
  <div className={styles.header}>
    <h1>{userData.username}</h1>

  {

    //  Hiding display of users ID unless there's a use case for it.
    // <h2>{userData.profiles.map(profile => profile.id)}</h2>
  }
  </div>
);
