import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextArea.css';

const TextArea = ({ className, value = '', ...props }) => (
  <div className={`${styles.textArea} ${className ? className : ''}`}>
    <textarea value={value} {...props} />
  </div>
);

TextArea.propTypes = {
  onChange: PropTypes.func,
};

export default TextArea;
