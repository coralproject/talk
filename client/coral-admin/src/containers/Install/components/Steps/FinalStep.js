import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <p>
        Thanks for installing Talk! We sent an email to your team member.
        While they finish setting up their account, start engaging with your readers now.
      </p>
      <Button onClick={nextStep}>Launch Talk</Button>
      <Button cStyle='black' onClick={nextStep}>Close this Installer</Button>
    </div>
  );
};

export default InitialStep;
