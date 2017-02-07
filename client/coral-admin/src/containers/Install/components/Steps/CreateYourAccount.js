import React from 'react';
import styles from './style.css';
import {FormField, Button, Spinner} from 'coral-ui';

const InitialStep = props => {
  const {handleUserChange, handleUserSubmit, install} = props;
  return (
    <div className={styles.step}>
      <div className={styles.form}>
        <form onSubmit={handleUserSubmit}>
          <FormField
            className={styles.formField}
            id="email"
            type="email"
            label='Email address'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.email}
            noValidate
            />

          <FormField
            className={styles.formField}
            id="displayName"
            type="text"
            label='Username'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.displayName}
            />

          <FormField
            className={styles.formField}
            id="password"
            type="password"
            label='Password'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.password}
            />

          <FormField
            className={styles.formField}
            id="confirmPassword"
            type="password"
            label='Confirm Password'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.confirmPassword}
            />

          {
            !props.install.isLoading ?
            <Button cStyle='black' type="submit" full>Save</Button>
            :
            <Spinner />
          }
          {props.install.installRequest === 'FAILURE' && <div className={styles.error}>Error: {props.install.installRequestError}</div>}
        </form>
      </div>
    </div>
  );
};

export default InitialStep;
