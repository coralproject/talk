import React from 'react';
import PropTypes from 'prop-types';
import styles from './InputField.css';
import ErrorMessage from './ErrorMessage';
import { Icon } from 'plugin-api/beta/client/components/ui';

const InputField = ({
  id = '',
  label = '',
  type = 'text',
  name = '',
  onChange = () => {},
  value = '',
  showError = true,
  hasError = false,
  errorMsg = '',
  children,
}) => {
  return (
    <li className={styles.detailItem}>
      <div className={styles.detailItemContainer}>
        <div className={styles.detailItemContent}>
          <label className={styles.detailLabel} id={id}>
            {label}
          </label>
          <input
            id={id}
            type={type}
            name={name}
            className={styles.detailValue}
            onChange={onChange}
            value={value}
            autoComplete="off"
          />
        </div>
        <div className={styles.detailItemMessage}>
          {!hasError &&
            value && <Icon className={styles.checkIcon} name="check_circle" />}
          {hasError && showError && <ErrorMessage>{errorMsg}</ErrorMessage>}
        </div>
      </div>
      {children}
    </li>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  showError: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMsg: PropTypes.string,
  children: PropTypes.node,
};

export default InputField;
