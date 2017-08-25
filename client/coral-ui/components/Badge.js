import React from 'react';
import styles from './Badge.css';
import Icon from './Icon';
import cn from 'classnames';

const Badge = ({className, children, icon, props}) => (
  <span className={cn(styles.badge, className)} {...props}>
    {icon && <Icon name={icon} className={styles.icon} />}
    {children}
  </span>
);

export default Badge;
