import React from 'react';
import cn from 'classnames';
import styles from './DefaultQuestionBoxIcon.css';
import { Icon } from 'coral-ui';

const DefaultQuestionBoxIcon = ({ className }) => (
  <div className={cn(styles.root, className)}>
    <Icon name="chat_bubble" className={cn(styles.iconBubble)} />
    <Icon name="person" className={cn(styles.iconPerson)} />
  </div>
);

export default DefaultQuestionBoxIcon;
