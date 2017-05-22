import React from 'react';
import styles from '../Community.css';
import BanUserButton from './BanUserButton';
import {Button} from 'coral-ui';
import {menuActionsMap} from '../../../containers/ModerationQueue/helpers/moderationQueueActionsMap';

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
    >{menuActionsMap[type].text}</Button>
  );
};

export default ActionButton;
