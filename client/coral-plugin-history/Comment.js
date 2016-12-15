import React, {PropTypes} from 'react';

import styles from './Comment.css';

const Comment = props => {
  return (
    <div>
      <p className="myCommentAsset">
        <a className={`${styles.assetURL} myCommentAnchor`} href={props.asset.url}>{props.asset.url}</a>
      </p>
      <p className={`${styles.commentBody} myCommentBody`}>{props.comment.body}</p>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    body: PropTypes.string
  }).isRequired,
  asset: PropTypes.shape({
    url: PropTypes.string
  }).isRequired
};

export default Comment;
