import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

const isApproved = (status) => (status === 'ACCEPTED');

export default ({approveComment, comment: {status}}) => (
  <button className={cn(styles.button, {[styles.approved]: isApproved(status)}, 'talk-plugin-moderation-actions-reject')} onClick={approveComment}>
    {isApproved(status) ? (
      <span>
        <Icon name="check_circle" className={styles.icon} />
        {t('talk-plugin-moderation-actions.approved_comment')}
      </span>
    ) : (
      <span>
        <Icon name="done" className={styles.icon} />
        {t('talk-plugin-moderation-actions.approve_comment')}
      </span>
    )}
  </button>
);
