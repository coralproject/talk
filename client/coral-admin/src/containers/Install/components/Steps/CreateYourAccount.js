import React from 'react';
import styles from './style.css';
import {FormField, Button} from 'coral-ui';

const InitialStep = props => {
  const {handleSubmit, handleUserChange} = props;
  return (
    <div className={styles.step}>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <FormField
            className={styles.formField}
            id="email"
            type="email"
            label='Email address' required
            onChange={handleUserChange}
            />

          <FormField
            className={styles.formField}
            id="username"
            type="text"
            label='Username'
            onChange={handleUserChange}
             />

          <FormField
            className={styles.formField}
            id="password"
            type="password"
            label='Password'
            onChange={handleUserChange}
             />

          <FormField
            className={styles.formField}
            id="confirmPassword"
            type="password"
            label='Confirm Password'
            onChange={handleUserChange}
             />

          <Button cStyle='black' type="submit" full>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default InitialStep;
