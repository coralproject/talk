import React, {PropTypes} from 'react';
import styles from './ModerationList.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../containers/ModerationQueue/helpers/moderationQueueActionsMap';

const ActionButton = ({type = '', status, ...props}) => {
  const typeName = type.toLowerCase();
  const active = ((type === 'REJECT' && status === 'REJECTED') || (type === 'APPROVE' && status === 'ACCEPTED'));
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
  status: PropTypes.string
};

export default ActionButton;
