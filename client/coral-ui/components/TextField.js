import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextField.css';

const TextField = ({
  className,
  showErrors = false,
  errorMsg,
  label,
  ...props
}) => (
  <div className={`${styles.textField} ${className ? className : ''}`}>
    <label htmlFor={props.id}>{label}</label>
    <input
      className={showErrors && errorMsg ? styles.error : ''}
      name={props.id}
      {...props}
    />
    {showErrors &&
      errorMsg && (
        <span className={styles.errorMsg}>
          <span className={styles.attention}>!</span>
          {errorMsg}
        </span>
      )}
  </div>
);

TextField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  showErrors: PropTypes.bool,
};

export default TextField;
