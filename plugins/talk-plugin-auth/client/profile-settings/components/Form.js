import React from 'react';
import styles from './Form.css';
import PropTypes from 'prop-types';

const Form = ({ children, className = '' }) => (
  <form className={className}>
    <ul className={styles.detailList}>{children}</ul>
  </form>
);

Form.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Form;
