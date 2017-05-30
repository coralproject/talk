import React, {PropTypes} from 'react';
import styles from './ModerationList.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../containers/ModerationQueue/helpers/moderationQueueActionsMap';

import t from 'coral-framework/services/i18n';

const ActionButton = ({type = '', active, ...props}) => {
  const typeName = type.toLowerCase();
  let text = menuActionsMap[type].text;

  if (text === 'approve' && active) {
    text = 'approved';
  } else if (text === 'reject' && active) {
    text = 'rejected';
  }

  return (
    <Button
      className={`${typeName} ${styles.actionButton} ${props.minimal ? styles.minimal : ''} ${active ? styles[`${typeName}__active`] : ''}`}
      cStyle={typeName}
      icon={menuActionsMap[type].icon}
      onClick={type === 'APPROVE' ? props.acceptComment : props.rejectComment}
    >{props.minimal ? '' : t(`modqueue.${text}`)}</Button>
  );
};

ActionButton.propTypes = {
  active: PropTypes.bool
};

export default ActionButton;
