import React, {PropTypes} from 'react';
import styles from './ProfileHeader.css';

const ProfileHeader = ({username}) => (
  <div className={styles.header}>
    <h1>{username}</h1>
  </div>
);

ProfileHeader.propTypes = {username: PropTypes.string.isRequired};

export default ProfileHeader;
