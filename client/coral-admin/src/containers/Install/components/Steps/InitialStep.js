import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <p>
        The remainder of the Talk installation will take about ten minutes.
      </p>
      <Button cStyle='green' onClick={nextStep} raised>Get Started</Button>
    </div>
  );
};

export default InitialStep;
