import React from 'react';
import styles from './style.css';
import {FormField, Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <div className={styles.form}>
        <form>
          <FormField
            className={styles.formField}
            id="email"
            type="email"
            label='Email address' required/>

          <FormField
            className={styles.formField}
            id="username"
            type="text"
            label='Username' required/>

          <FormField
            className={styles.formField}
            id="password"
            type="password"
            label='Password' required/>

          <FormField
            className={styles.formField}
            id="confirmPassword"
            type="password"
            label='Confirm Password' required/>

          <Button cStyle='black' onClick={nextStep} full>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default InitialStep;
