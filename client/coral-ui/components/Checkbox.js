import React from 'react';
import styles from './Checkbox.css';
import cn from 'classnames';
import PropTypes from 'prop-types';

const Checkbox = ({ onChange, checked, className, ...rest }) => (
  <label className={cn(styles.root, className)}>
    <input
      type="checkbox"
      className={cn(styles.input, { [styles.inputChecked]: checked })}
      onChange={onChange}
      checked={checked}
      {...rest}
    />
    <span
      className={cn(styles.checkbox, { [styles.checkboxChecked]: checked })}
      aria-hidden="true"
    />
  </label>
);

Checkbox.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

export default Checkbox;
