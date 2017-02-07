import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';
import {Link} from 'react-router';

const InitialStep = () => {
  return (
    <div className={`${styles.step} ${styles.finalStep}`}>
      <p>
        Thanks for installing Talk! We sent an email to verify your email
        address. While you finish setting the account, you can start engaging
        with your readers now.
      </p>
      <Button raised><Link to='/admin'>Launch Talk</Link></Button>
      <Button cStyle='black' raised><a href="http://coralproject.net">Close this Installer</a></Button>
    </div>
  );
};

export default InitialStep;
