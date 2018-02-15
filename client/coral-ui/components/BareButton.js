import React from 'react';
import PropTypes from 'prop-types';
import styles from './BareButton.css';
import cn from 'classnames';

/**
 *  BareButton is a button whose styling is stripped off to a minimum.
 *  Can pass anchor=true to use `a` instead of `button`
 */
const BareButton = ({ anchor, className, ...props }) => {
  let Element = 'button';
  if (anchor) {
    Element = 'a';
  }
  return <Element {...props} className={cn(styles.bare, className)} />;
};

BareButton.propTypes = {
  className: PropTypes.string,
  anchor: PropTypes.bool,
};

export default BareButton;
