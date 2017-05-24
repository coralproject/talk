import React, {PropTypes} from 'react';
import styles from './ModerationList.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../routes/Moderation/helpers/moderationQueueActionsMap';

const ActionButton = ({type = '', active, ...props}) => {
  const typeName = type.toLowerCase();
  let text = menuActionsMap[type].text;

  if (text === 'Approve' && active) {
    text = 'Approved';
  } else if (text === 'Reject' && active) {
    text = 'Rejected';
  }

  return (
    <Button
      className={`${typeName} ${styles.actionButton} ${active ? styles[`${typeName}__active`] : ''}`}
      cStyle={typeName}
      icon={menuActionsMap[type].icon}
      onClick={type === 'APPROVE' ? props.acceptComment : props.rejectComment}
    >{text}</Button>
  );
};

ActionButton.propTypes = {
  active: PropTypes.bool
};

export default ActionButton;
