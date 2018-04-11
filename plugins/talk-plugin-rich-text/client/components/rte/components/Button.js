import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.css';
import cn from 'classnames';

class Button extends React.Component {
  render() {
    const {
      className,
      title,
      onClick,
      children,
      active,
      activeClassName,
      disabled,
    } = this.props;
    return (
      <button
        className={cn(className, styles.button, {
          [cn(styles.active, activeClassName)]: active,
        })}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Button;
