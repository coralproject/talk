import React, {PropTypes} from 'react';
import styles from './TextArea.css';

const TextArea = ({className, value = '', ...props}) => (
  <div className={`${styles.textArea} ${className ? className : ''}`} {...props}>
    <textarea value={value} />
  </div>
);

TextArea.propTypes = {
  onChange: PropTypes.func,
};

export default TextArea;
