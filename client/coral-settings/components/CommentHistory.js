import React from 'react';
import styles from './CommentHistory.css';

export default ({comments = []}) => (
  <div className={styles.header}>
    <h1>Comments</h1>
    <ul>
      {comments.map(() => (
        <li>
          {/* Comment Data*/}
        </li>
      ))}
    </ul>
  </div>
);
