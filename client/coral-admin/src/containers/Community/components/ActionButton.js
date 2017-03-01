import React from 'react';
import styles from '../Community.css';
import BanUserButton from '../../../components/BanUserButton';
import {FabButton} from 'coral-ui';
import {menuActionsMap} from '../../../containers/ModerationQueue/helpers/moderationQueueActionsMap';

const ActionButton = ({type = '', user, ...props}) => {
  if (type === 'BAN') {
    return <BanUserButton user={user} onClick={() => props.showBanUserDialog(user)} />;
  }

  return (
    <FabButton
      className={`${type.toLowerCase()} ${styles.actionButton}`}
      cStyle={type.toLowerCase()}
      icon={menuActionsMap[type].icon}
      onClick={type === 'APPROVE' ? props.acceptUser : props.rejectUser}
    />
  );
};

export default ActionButton;
