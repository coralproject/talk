import React from 'react';
import styles from './NotLoggedIn.css';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';

export default ({showSignInDialog}) => (
  <div className={styles.message}>
    <SignInContainer noButton={true}/>
    <div>
      <a onClick={() => {
        console.log('Signin click');
        showSignInDialog();
      }}>Sign In</a> to access Settings
    </div>
    <div>
      From the Settings Page you can
      <ul>
        <li>See your comment history</li>
      </ul>
    </div>
  </div>
);
