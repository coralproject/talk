import React from 'react';
// import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep, previousStep} = props;
  return (
    <div>
      <h2>Welcome to the Coral Project</h2>
      <p>
        Please tell us the name of your organization. This will appear in emails when
        inviting new team members
      </p>
      <Button onClick={previousStep}>Go back</Button>
    </div>
  );
};

export default InitialStep;
