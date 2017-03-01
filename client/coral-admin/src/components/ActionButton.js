import React from 'react';
import styles from './ModerationList.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../containers/ModerationQueue/helpers/moderationQueueActionsMap';

const ActionButton = ({type = '', ...props}) => {
  return (
    <Button
      className={`${type.toLowerCase()} ${styles.actionButton}`}
      cStyle={type.toLowerCase()}
      icon={menuActionsMap[type].icon}
      onClick={type === 'APPROVE' ? props.acceptComment : props.rejectComment}
    >{menuActionsMap[type].text}</Button>
  );
};

export default ActionButton;
