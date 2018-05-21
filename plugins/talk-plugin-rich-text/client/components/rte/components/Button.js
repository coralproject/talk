import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.css';
import cn from 'classnames';

class Button extends React.Component {
  render() {
    const {
      className,
      children,
      active,
      activeClassName,
      ...rest
    } = this.props;
    return (
      <button
        className={cn(className, styles.button, {
          [cn(styles.active, activeClassName)]: active,
        })}
        {...rest}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  children: PropTypes.node,
  active: PropTypes.bool,
};

export default Button;
