import React, {PropTypes} from 'react';
import Comment from './Comment';
import styles from './CommentHistory.css';

const CommentHistory = props => {
  return (
    <div className={styles.header}>
      <h2>All Comments</h2>
      {props.comments.map((comment, i) => {
        const asset = props.assets.find(asset => asset.id === comment.asset_id);
        return <Comment
          key={i}
          comment={comment}
          asset={asset} />;
      })}
    </div>
  );
};

CommentHistory.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  assets: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CommentHistory;
