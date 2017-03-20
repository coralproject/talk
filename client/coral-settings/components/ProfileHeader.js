import React, { PropTypes } from 'react';
import styles from './ProfileHeader.css';

const ProfileHeader = ({ userData }) => (
  <div className={styles.header}>
    <h1>{userData.username}</h1>
    <ul>
      {userData.profiles.map((item, i) => <li key={i}>{item.id}</li>)}
    </ul>
  </div>
);

// ProfileHeader.propTypes = {username: PropTypes.string.isRequired};

export default ProfileHeader;
