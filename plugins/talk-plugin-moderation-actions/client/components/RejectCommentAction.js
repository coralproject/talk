import React from 'react';
import cn from 'classnames';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';

export default ({rejectComment}) => (
  <button className={cn(styles.button, 'talk-plugin-moderation-actions-reject')} onClick={rejectComment}>
    <Icon name="clear" className={styles.icon} />
    {t('talk-plugin-moderation-actions.reject_comment')}
  </button>
);
