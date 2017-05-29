import React from 'react';
import styles from './Community.css';
import BanUserButton from './BanUserButton';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../../Moderation/helpers/moderationQueueActionsMap';

import t from 'coral-framework/services/i18n';

const ActionButton = ({type = '', user, ...props}) => {
  if (type === 'BAN') {
    return <BanUserButton icon='not interested' user={user} onClick={() => props.showBanUserDialog(user)} />;
  }

  return (
    <Button
      className={`${type.toLowerCase()} ${styles.actionButton}`}
      cStyle={type.toLowerCase()}
      icon={menuActionsMap[type].icon}
      onClick={() => {
        type === 'APPROVE' ? props.approveUser({userId: user.id}) : props.showSuspendUserDialog({user: user});
      }}
    >{t(`modqueue.${menuActionsMap[type].text}`)}</Button>
  );
};

export default ActionButton;
