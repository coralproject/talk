import React from 'react';
import PropTypes from 'prop-types';
import {Icon as IconMDL}  from 'react-mdl';
import cn from 'classnames';
import styles from './Icon.css';

const Icon = ({className = '', name}) => (
  <IconMDL className={cn(styles.root, className)} name={name} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired
};

export default Icon;
