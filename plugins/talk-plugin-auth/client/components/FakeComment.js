import React from 'react';
import t from 'coral-framework/services/i18n';
import { ReplyButton } from 'talk-plugin-replies';
import styles from './FakeComment.css';
import { Icon } from 'plugin-api/beta/client/components/ui';
import { CommentTimestamp } from 'plugin-api/beta/client/components';

export const FakeComment = ({ username, created_at, body }) => (
  <div className={styles.root}>
    <span className={styles.authorName}>{username}</span>
    <CommentTimestamp created_at={created_at} />
    <div className={styles.body}>{body}</div>
    <div className={styles.footer}>
      <div>
        <button className={styles.button}>
          <span className={styles.label}>{t('like')}</span>
          <Icon name="thumb_up" className={styles.icon} />
        </button>
        <ReplyButton
          onClick={() => {}}
          parentCommentId={'commentID'}
          currentUserId={{}}
        />
      </div>
      <div>
        <button className={styles.button}>
          <span className={styles.label}>{t('permalink')}</span>
          <Icon name="link" className={styles.icon} />
        </button>
        <button className={styles.button}>
          <span className={styles.label}>{t('report')}</span>
          <Icon name="flag" className={styles.icon} />
        </button>
      </div>
    </div>
  </div>
);
