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
    } = this.props;
    return (
      <button
        className={cn(className, styles.button, {
          [cn(styles.active, activeClassName)]: active,
        })}
        title={title}
        onClick={onClick}
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
};

export default Button;
