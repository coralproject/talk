import React from 'react';
import styles from './RejectCommentAction.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

export default ({rejectComment}) => (
  <button className={cn(styles.button, 'talk-plugin-moderation-actions-reject')} onClick={rejectComment}>
    <Icon name="clear" className={styles.icon} />
    {t('talk-plugin-moderation-actions.reject_comment')}
  </button>
);
