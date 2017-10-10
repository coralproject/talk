import React from 'react';
import PropTypes from 'prop-types';
import styles from './Option.css';
import cn from 'classnames';

const Option = ({className, children, onClick}) => (
  <li className={cn(styles.option, className)} onClick={onClick}>
    {children || ''}
  </li>
);

Option.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
  onClick: PropTypes.func
};

export default Option;
