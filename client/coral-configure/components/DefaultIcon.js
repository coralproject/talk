import React from 'react';
import cn from 'classnames';
import styles from './DefaultIcon.css';
import {Icon} from 'coral-ui';

const DefaultIcon = ({className}) => (
  <div className={cn(styles.qbIconContainer, className)}>
    <Icon name="chat_bubble" className={cn(styles.iconBubble)} />
    <Icon name="person" className={cn(styles.iconPerson)} />
  </div>
);

export default DefaultIcon;
