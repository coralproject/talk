import React from 'react';
import styles from './style.css';
import {TextField, Button, Spinner} from 'coral-ui';

import t from 'coral-i18n/services/i18n';

const InitialStep = (props) => {
  const {handleUserChange, handleUserSubmit, install} = props;
  return (
    <div className={styles.step}>
      <div className={styles.form}>
        <form onSubmit={handleUserSubmit}>
          <TextField
            className={styles.textField}
            id="email"
            type="email"
            label={t('CREATE.EMAIL')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.email}
            noValidate
            />

          <TextField
            className={styles.textField}
            id="username"
            type="text"
            label={t('CREATE.USERNAME')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.username}
            />

          <TextField
            className={styles.textField}
            id="password"
            type="password"
            label={t('CREATE.PASSWORD')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.password}
            />

          <TextField
            className={styles.textField}
            id="confirmPassword"
            type="password"
            label={t('CREATE.CONFIRM_PASSWORD')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.confirm_password}
            />

          {
            !props.install.isLoading ?
            <Button cStyle='black' type="submit" full>{t('CREATE.SAVE')}</Button>
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
