import React, {PropTypes} from 'react';
import styles from './FormField.css';

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
    {showErrors && errorMsg && <span className={styles.errorMsg}><span className={styles.attention}>!</span>{errorMsg}</span>}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
  type: PropTypes.string
};

export default FormField;
