import React from 'react';
import styles from './style.css';
import {TextField, Button, Spinner} from 'coral-ui';

const InitialStep = props => {
  const {handleUserChange, handleUserSubmit, install} = props;
  return (
    <div className={styles.step}>
      <div className={styles.form}>
        <form onSubmit={handleUserSubmit}>
          <TextField
            className={styles.textField}
            id="email"
            type="email"
            label='Email address'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.email}
            noValidate
            />

          <TextField
            className={styles.textField}
            id="username"
            type="text"
            label='Username'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.username}
            />

          <TextField
            className={styles.textField}
            id="password"
            type="password"
            label='Password'
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.password}
            />

          <TextField
            className={styles.textField}
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
