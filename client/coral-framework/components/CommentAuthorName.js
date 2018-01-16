import React from 'react';
import styles from './CommentAuthorName.css';

const CommentAuthorName = ({ comment }) => (
  <span className={styles.authorName}>{comment.user.username}</span>
);

export default CommentAuthorName;
