import React from 'react';
import styles from './ModerationList.css';
import BanUserButton from './BanUserButton';
import {FabButton} from 'coral-ui';
import {menuActionsMap} from '../containers/ModerationQueue/helpers/moderationQueueActionsMap';

const ActionButton = ({type = '', user, ...props}) => {
  if (type === 'BAN') {
    return <BanUserButton user={user} onClick={() => props.showBanUserDialog(props.user, props.id)} />;
  }

  return (
    <FabButton
      className={`${type.toLowerCase()} ${styles.actionButton}`}
      cStyle={type.toLowerCase()}
      icon={menuActionsMap[type].icon}
      onClick={() => {}}
    />
  );
};

export default ActionButton;

