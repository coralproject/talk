import React from 'react';
import cn from 'classnames';
import styles from './QuestionBox.css';
import { Icon } from 'coral-ui';
import Markdown from 'coral-framework/components/Markdown';
import DefaultQuestionBoxIcon from './DefaultQuestionBoxIcon';

const QuestionBox = ({ content, icon, className, children }) => (
  <div className={cn(styles.qbInfo, 'questionbox-info', className)}>
    {icon === 'default' ? (
      <div className={cn(styles.qbIconContainer)}>
        <DefaultQuestionBoxIcon />
      </div>
    ) : (
      <div className={cn(styles.qbIconContainer)}>
        <Icon name={icon} className={cn(styles.icon)} />
      </div>
    )}
    <div className={cn(styles.qbContent, 'questionbox-content')}>
      <Markdown content={content} />
    </div>
    {children}
  </div>
);

export default QuestionBox;
