import React from 'react';
import styles from './RejectCommentAction.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

const isApproved = (status) => status === "APPROVED";

export default ({comment: {status}, approveComment}) => (
  <button className={cn(styles.button, 'talk-plugin-moderation-actions-reject')} onClick={approveComment}>
    {isApproved(status) ? (
      <span>
        <Icon name="done" className={cn(styles.icon, styles.approved)} />
        {t('talk-plugin-moderation-actions.approved_comment')}
      </span>
    ) : (
      <span>
        <Icon name="done" className={cn(styles.icon)} />
        {t('talk-plugin-moderation-actions.approve_comment')}
      </span>
    )}
  </button>
);
