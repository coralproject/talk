import React, {PropTypes} from 'react';
import Comment from './Comment';
import styles from './CommentHistory.css';

const CommentHistory = props => {
  return (
    <div className={styles.header}>
      <h2>All Comments</h2>
      {props.comments.map((comment, i) => {
        console.log('a comment', comment);
        return <Comment key={i} comment={comment} />;
      })}
    </div>
  );
};

CommentHistory.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CommentHistory;
