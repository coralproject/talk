import React from 'react';
import styles from './styles.css';

const UserBox = ({className, user, logout, ...props}) => (
  <div
    className={`${styles.userBox} ${className}`}
    {...props}
  >
    Signed in as <a>{user.displayName}</a>. Not you? <a onClick={logout}>Sign out</a>
  </div>
);

export default UserBox;
