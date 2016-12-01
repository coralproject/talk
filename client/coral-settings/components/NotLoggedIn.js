import React from 'react';
import styles from './NotLoggedIn.css';

export default ({showSignInDialog}) => (
  <div className={styles.message}>
    <div>
      <a onClick={showSignInDialog}>Sign In</a> to access Settings
    </div>
    <div>
      From the Settings Page you can
      <ul>
        <li>See your comment history</li>
        <li>Write a bio about yourself to display to the community</li>
      </ul>
    </div>
  </div>
);
