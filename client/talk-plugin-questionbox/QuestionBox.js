import React from 'react';
import cn from 'classnames';
import styles from './QuestionBox.css';
import {Icon} from 'coral-ui';
import Markdown from 'coral-framework/components/Markdown';

import Slot from 'coral-framework/components/Slot';

const QuestionBox = ({content, enable, icon = '', className = ''}) => (
  <div className={cn(styles.qbInfo, {[styles.hidden]: !enable}, 'questionbox-info', className)}>
    {
      icon === 'default' ? (
        <div className={cn(styles.qbIconContainer)}>
          <Icon name="chat_bubble" className={cn(styles.iconBubble)} />
          <Icon name="person" className={cn(styles.iconPerson)} />
        </div>
      ) : (
        <div className={cn(styles.qbIconContainer)}>
          <Icon name={icon} className={cn(styles.icon)} />
        </div>
      )
    }
    <div className={cn(styles.qbContent, 'questionbox-content')}>
      <Markdown content={content} />
    </div>

    <Slot fill="streamQuestionArea" />
  </div>
);

export default QuestionBox;
