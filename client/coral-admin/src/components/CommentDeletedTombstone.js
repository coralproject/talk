import React from 'react';
import styles from './CommentDeletedTombstone.css';
import t from 'coral-framework/services/i18n';

const CommentDeletedTombstone = () => (
  <div className={styles.tombstone}>{t('framework.comment_is_deleted')}</div>
);

export default CommentDeletedTombstone;
