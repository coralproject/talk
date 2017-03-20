import React, { PropTypes } from 'react';
import styles from './TextArea.css';

const TextArea = ({ className, value = '', ...props }) => (
  <div className={`${styles.textArea} ${className ? className : ''}`}>
    <textarea value={value} {...props}/>
  </div>
);

TextArea.propTypes = {
  onChange: PropTypes.func,
};

export default TextArea;
