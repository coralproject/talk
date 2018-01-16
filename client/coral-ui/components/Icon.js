import React from 'react';
import PropTypes from 'prop-types';
import { Icon as IconMDL } from 'react-mdl';
import cn from 'classnames';
import styles from './Icon.css';

const Icon = ({ className = '', ...rest }) => (
  <IconMDL className={cn(styles.root, className)} {...rest} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Icon;
