import React from 'react';
import PropTypes from 'prop-types';
import styles from './Option.css';
import cn from 'classnames';

const Option = ({className, label = '', onClick}) => (
  <li className={cn(styles.option, className)} onClick={onClick}>
    {label}
  </li>
);

Option.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool
  ]),
};

export default Option;
