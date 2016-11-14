import React from 'react';
import styles from './styles.css';

const FormField = ({className, showErrors = false, errorMsg, label, ...props}) => (
  <div className={`${styles.formField} ${className ? className : ''}`}>
    <label htmlFor={props.id}>
      {label}
    </label>
    <input
      className={showErrors && errorMsg ? styles.error : ''}
      name={props.id}
      {...props}
    />
    {showErrors && errorMsg && <span className={styles.errorMsg}>{errorMsg}</span>}
  </div>
);

export default FormField;
