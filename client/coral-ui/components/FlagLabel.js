import React from 'react';
import PropTypes from 'prop-types';
import styles from './FlagLabel.css';
import Label from './Label';
import cn from 'classnames';

const FlagLabel = ({ iconName, children, className }) => {
  return (
    <Label iconName={iconName} className={cn(className, styles.flag)}>
      {children}
    </Label>
  );
};

FlagLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  iconName: PropTypes.string,
};

export default FlagLabel;
