import React from 'react';
import styles from './style.css';
import {TextField, Button, Spinner} from 'coral-ui';

const lang = new I18n(translations);
import translations from '../../translations.json';
import I18n from 'coral-framework/modules/i18n/i18n';

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
            label={lang.t('CREATE.EMAIL')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.email}
            noValidate
            />

          <TextField
            className={styles.textField}
            id="username"
            type="text"
            label={lang.t('CREATE.USERNAME')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.username}
            />

          <TextField
            className={styles.textField}
            id="password"
            type="password"
            label={lang.t('CREATE.PASSWORD')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.password}
            />

          <TextField
            className={styles.textField}
            id="confirmPassword"
            type="password"
            label={lang.t('CREATE.CONFIRM_PASSWORD')}
            onChange={handleUserChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.confirmPassword}
            />

          {
            !props.install.isLoading ?
            <Button cStyle='black' type="submit" full>{lang.t('CREATE.SAVE')}</Button>
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
