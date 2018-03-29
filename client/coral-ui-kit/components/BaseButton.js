import React from 'react';
import PropTypes from 'prop-types';
import styles from './BaseButton.css';
import cn from 'classnames';
import { withKeyboardFocus, withStyles } from '../hocs';
import { compose } from 'recompose';

/**
 * A button whose styling is stripped off to a minimum.
 */
const BaseButton = ({ anchor, className, classes, keyboardFocus, ...rest }) => {
  let Element = 'button';
  if (anchor) {
    Element = 'a';
  }

  const rootClassName = cn(classes.root, className, {
    [classes.keyboardFocus]: keyboardFocus,
  });

  return <Element {...rest} className={rootClassName} />;
};

BaseButton.propTypes = {
  className: PropTypes.string,
  /** If set renders an anchor tag instead */
  anchor: PropTypes.bool,
  classes: PropTypes.object,
  keyboardFocus: PropTypes.bool,
};

const enhance = compose(withStyles(styles), withKeyboardFocus);

export default enhance(BaseButton);
