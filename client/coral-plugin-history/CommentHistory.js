import React, {PropTypes} from 'react';

import styles from './CommentHistory.css';

const CommentHistory = props => {
  return (
    <div className={styles.header}>
      <h1>Comment History</h1>
      {props.comments.map((comment, i) => {
        console.log('a comment', comment);
        return <p key={i}>{comment.body}</p>;
      })}
    </div>
  );
};

CommentHistory.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CommentHistory;
