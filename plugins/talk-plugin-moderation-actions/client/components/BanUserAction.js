import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

export default ({onBanUser}) => (
  <button 
    className={cn(styles.button, 'talk-plugin-moderation-actions-reject')}
    onClick={onBanUser} >
    <Icon name="block" className={styles.icon} />
    {t('talk-plugin-moderation-actions.ban_user')}
  </button>
);
