import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <p>
        Please tell us the name of your organization. This will appear in emails when
        inviting new team members
      </p>
      <form>
        <label htmlFor='organizationName'>Organization name:</label>
        <input type='text' name='organizationName' id='organizationName'/>
        <Button cStyle='black' onClick={nextStep} full>Save</Button>
      </form>
    </div>
  );
};

export default InitialStep;
