import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <p>
        The remainder of the Talk installation will take about ten minutes.
        Once you complete the following three steps, you will have a free
        installation and provision of Mongo and Redis.
      </p>
      <Button cStyle='green' onClick={nextStep}>Get Started</Button>
    </div>
  );
};

export default InitialStep;
