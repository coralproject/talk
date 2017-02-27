import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const WhitelistStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <h3>Domain Whitelist</h3>
      <Button cStyle='green' onClick={nextStep} raised>Add domains</Button>
    </div>
  );
};

export default WhitelistStep;
