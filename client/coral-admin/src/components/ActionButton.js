import React from 'react';
import styles from './ModerationList.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import {FabButton, Button, Icon} from 'coral-ui';

const ActionButton = ({option, type, comment = {}, user, menuOptionsMap, onClickAction, onClickShowBanDialog}) =>
{
  const banned = user.status === 'BANNED';

  if (option === 'flag' && (type === 'USERS' || comment.status || comment.flagged === true)) {
    return null;
  }
  if (option === 'ban') {
    return (
      <div className={styles.ban}>
        <Button
          className={`ban ${styles.banButton}`}
          cStyle='darkGrey'
          disabled={banned ? 'disabled' : ''}
          onClick={() => onClickShowBanDialog(user.id, user.username, comment.id)
          }
          raised
        >
          <Icon name='not_interested' className={styles.banIcon} />
          {lang.t('comment.ban_user')}
        </Button>
      </div>
    );
  }
  const menuOption = menuOptionsMap[option];
  const action = {
    item_type: type,
    item_id: type === 'COMMENTS' ? comment.id : user.id
  };
  return (
    <FabButton
      className={`${option} ${styles.actionButton}`}
      cStyle={option}
      icon={menuOption.icon}
      onClick={() => onClickAction(menuOption.status, type === 'COMMENTS' ? comment : user, action)}
    />
  );
};

export default ActionButton;

const lang = new I18n(translations);
