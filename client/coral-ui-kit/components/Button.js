import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.css';
import cn from 'classnames';
import BaseButton from './BaseButton';
import { withStyles } from '../hocs';
import { compose } from 'recompose';
import pick from 'lodash/pick';

class Button extends React.Component {
  render() {
    const {
      classes,
      className,
      fullWidth,
      invert,
      primary,
      secondary,
      ...rest
    } = this.props;

    const rootClassName = cn(classes.root, className, {
      [classes.invert]: invert,
      [classes.fullWidth]: fullWidth,
      [classes.primary]: primary,
      [classes.secondary]: secondary,
    });

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, 'keyboardFocus')}
        {...rest}
      />
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  fullWidth: PropTypes.bool,
  invert: PropTypes.bool,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
};

const enhance = compose(withStyles(styles));

export default enhance(Button);
