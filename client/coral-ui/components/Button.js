import React from 'react';
import styles from './Button.css';
import Icon from './Icon';

export default class Button extends React.Component {
  render() {
    const {
      cStyle = 'local',
      children,
      className,
      raised = false,
      full = false,
      icon = '',
      ...props
    } = this.props;
    return (
      <button
        className={`
          ${styles.button}
          ${styles[`type--${cStyle}`]}
          ${className}
          ${full ? styles.full : ''}
          ${raised ? styles.raised : ''}
        `}
        {...props}
      >
        {icon && <Icon name={icon} className={styles.icon} />}
        {children}
      </button>
    );
  }
}
