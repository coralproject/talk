import React, {PropTypes} from 'react';
import Comment from './Comment';
import styles from './CommentHistory.css';

const CommentHistory = props => {
  return (
    <div className={`${styles.header} commentHistory`}>
      <h2>All Comments</h2>
      <div className="commentHistory__list">
        {props.comments.map((comment, i) => {
          const asset = props.assets.find(asset => asset.id === comment.asset_id);
          return <Comment
            key={i}
            comment={comment}
            asset={asset} />;
        })}
      </div>
    </div>
  );
};

CommentHistory.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  assets: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CommentHistory;
