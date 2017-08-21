import React from 'react';
import styles from './AuthorName.css';

const AuthorName = ({comment}) => 
  <span className={styles.authorName}>
    {comment.user.username}
  </span>;

export default AuthorName;
