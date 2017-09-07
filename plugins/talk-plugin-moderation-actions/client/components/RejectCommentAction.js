import React from 'react';
import styles from './RejectCommentAction.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

export default ({rejectComment}) => (
  <button
    className={cn(styles.button, 'talk-plugin-reject-comment-action')}
    onClick={rejectComment}>
    <Icon name="clear" />
    {t('talk-plugin-reject-comment.reject_comment')}
  </button>
);
