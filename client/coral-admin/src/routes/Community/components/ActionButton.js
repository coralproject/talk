import React from 'react';
import styles from './Community.css';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../../Moderation/helpers/moderationQueueActionsMap';

import t from 'coral-framework/services/i18n';

const ActionButton = ({type = '', user, ...props}) => {
  return (
    <Button
      className={`${type.toLowerCase()} ${styles.actionButton}`}
      cStyle={type.toLowerCase()}
      icon={menuActionsMap[type].icon}
      onClick={() => {
        type === 'APPROVE' ? props.approveUser({userId: user.id}) : props.showRejectUsernameDialog({user: user});
      }}
    >{t(`modqueue.${menuActionsMap[type].text}`)}</Button>
  );
};

export default ActionButton;
