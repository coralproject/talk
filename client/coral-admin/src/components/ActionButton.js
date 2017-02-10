import React from 'react';
import styles from './ModerationList.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import {FabButton, Button, Icon} from 'coral-ui';

const ActionButton = ({type, user}) => {
  const menuOptionsMap = {
    'reject': {status: 'REJECTED', icon: 'close', key: 'r'},
    'approve': {status: 'ACCEPTED', icon: 'done', key: 't'},
    'flag': {status: 'FLAGGED', icon: 'flag', filter: 'Untouched'},
    'ban': {status: 'BANNED', icon: 'not interested'}
  };

  if (type === 'ban') {
    return (
      <div className={styles.ban}>
        <Button
          className={`ban ${styles.banButton}`}
          cStyle='darkGrey'
          disabled={user.status === 'BANNED' ? 'disabled' : ''}
          onClick={() => {}}
          raised>
          <Icon name='not_interested' className={styles.banIcon} />
          {lang.t('comment.ban_user')}
        </Button>
      </div>
    );
  }

  return (
    <FabButton
      className={`${type} ${styles.actionButton}`}
      cStyle={type}
      icon={menuOptionsMap[type].icon}
      onClick={() => {}}
    />
  );

};

export default ActionButton;

const lang = new I18n(translations);
