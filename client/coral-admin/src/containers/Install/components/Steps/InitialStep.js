import React from 'react';
// import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div>
      <h2>Welcome to the Coral Project</h2>
      <p>
      The remainder of the Talk installation will take about ten minutes.
      Once you complete the following three steps, you will have a free
      installation and provision of Mongo and Redis.
      </p>
      <Button onClick={nextStep}>Get Started</Button>
    </div>
  );
};

export default InitialStep;
