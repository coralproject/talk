import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorMessage.css';
import { Icon } from 'plugin-api/beta/client/components/ui';

const ErrorMessage = ({ children }) => (
  <div className={styles.errorMsg}>
    <Icon className={styles.warningIcon} name="warning" />
    <span>{children}</span>
  </div>
);

ErrorMessage.propTypes = {
  children: PropTypes.node,
};

export default ErrorMessage;
