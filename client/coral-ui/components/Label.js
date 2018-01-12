import React from 'react';
import PropTypes from 'prop-types';
import styles from './Label.css';
import { Icon } from 'coral-ui';
import cn from 'classnames';

const Label = ({ iconName, children, className }) => {
  return (
    <span className={cn(className, styles.root)}>
      <Icon name={iconName} className={styles.icon} /> {children}
    </span>
  );
};

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  iconName: PropTypes.string,
};

export default Label;
