import React, {PropTypes} from 'react';
import Comment from './Comment';
import styles from './CommentHistory.css';

const CommentHistory = props => {
  return (
    <div className={`${styles.header} commentHistory`}>
      <div className="commentHistory__list">
        {props.comments.map((comment, i) => {
          return <Comment
            key={i}
            comment={comment}
            link={props.link}
            asset={comment.asset} />;
        })}
      </div>
    </div>
  );
};

CommentHistory.propTypes = {
  comments: PropTypes.array.isRequired
};

export default CommentHistory;
