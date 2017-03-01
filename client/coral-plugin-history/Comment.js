import React, {PropTypes} from 'react';
import styles from './Comment.css';

const Comment = props => {
  return (
    <div className={styles.myComment}>
      <p className="myCommentAsset">
        <a className={`${styles.assetURL} myCommentAnchor`} href='#' onClick={props.link(`${props.asset.url}#${props.comment.id}`)}>{props.asset.title ? props.asset.title : props.asset.url}</a>
      </p>
      <p className={`${styles.commentBody} myCommentBody`}>{props.comment.body}</p>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string
  }).isRequired,
  asset: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string
  }).isRequired
};

export default Comment;
