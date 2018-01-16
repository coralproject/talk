import React from 'react';
import styles from './Item.css';
import Icon from './Icon';

export default ({
  children,
  itemId,
  active,
  onItemClick,
  className = '',
  icon,
}) => (
  <li
    className={`${styles.base} ${className} ${active ? styles.active : ''}`}
    onClick={() => onItemClick(itemId)}
  >
    {icon && <Icon name={icon} />}
    {children}
  </li>
);
