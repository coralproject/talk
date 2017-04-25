import React, {PropTypes} from 'react';
import styles from './ModerationList.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../containers/ModerationQueue/helpers/moderationQueueActionsMap';

const ActionButton = ({type = '', status, ...props}) => {
  const typeName = type.toLowerCase();
  const active = ((type === 'REJECT' && status === 'REJECTED') || (type === 'APPROVE' && status === 'APPROVED'));

  return (
    <Button
      className={`${typeName} ${styles.actionButton} ${active ? styles[`${typeName}__active`] : ''}`}
      cStyle={typeName}
      icon={menuActionsMap[type].icon}
      onClick={type === 'APPROVE' ? props.acceptComment : props.rejectComment}
    >{menuActionsMap[type].text}</Button>
  );
};

ActionButton.propTypes = {
  status: PropTypes.string
};

export default ActionButton;
