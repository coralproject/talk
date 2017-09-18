import React from 'react';
import PropTypes from 'prop-types';

import styles from './ModerationList.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../utils/moderationQueueActionsMap';

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
  active: PropTypes.bool,
  type: PropTypes.oneOf(['APPROVE', 'REJECT']),
  minimal: PropTypes.bool,
  acceptComment: PropTypes.func,
  rejectComment: PropTypes.func,
};

export default ActionButton;
