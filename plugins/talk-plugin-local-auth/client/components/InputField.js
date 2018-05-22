import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './InputField.css';
import ErrorMessage from './ErrorMessage';
import { Icon } from 'plugin-api/beta/client/components/ui';
import uuid from 'uuid/v4';

const InputField = ({
  id = '',
  label = '',
  type = 'text',
  name = '',
  onChange = () => {},
  showError = true,
  errorMsg = '',
  children,
  columnDisplay = false,
  showSuccess = false,
  validationType = '',
  icon = '',
  value,
  defaultValue,
  disabled = false,
}) => {
  const inputValue = {
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
  };
  const computedId = id || (label && uuid());

  return (
    <div className={styles.detailItem}>
      <div className={cn(styles.detailItemContainer)}>
        {label && (
          <label className={styles.detailLabel} id={computedId}>
            {label}
          </label>
        )}
        <div
          className={cn(styles.detailItemContent, {
            [styles.columnDisplay]: columnDisplay,
          })}
        >
          <div
            className={cn(
              styles.detailInput,
              { [styles.error]: errorMsg && showError },
              { [styles.disabled]: disabled }
            )}
          >
            {icon && <Icon name={icon} className={styles.detailIcon} />}
            <input
              id={computedId}
              type={type}
              name={name}
              className={styles.detailValue}
              onChange={onChange}
              autoComplete="off"
              data-validation-type={validationType}
              disabled={disabled}
              {...inputValue}
            />
          </div>
          <div className={styles.detailItemMessage}>
            {!errorMsg &&
              showSuccess &&
              value && (
                <Icon className={styles.checkIcon} name="check_circle" />
              )}
            {errorMsg && showError && <ErrorMessage>{errorMsg}</ErrorMessage>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  icon: PropTypes.string,
  showError: PropTypes.bool,
  errorMsg: PropTypes.string,
  children: PropTypes.node,
  columnDisplay: PropTypes.bool,
  showSuccess: PropTypes.bool,
  validationType: PropTypes.string,
};

export default InputField;
