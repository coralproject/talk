import React, {PropTypes} from 'react';

import styles from './Comment.css';

const Comment = props => {
  return (
    <div>
      <p><a className={styles.assetURL} href={props.comment.asset_id}>{props.comment.asset_id}</a></p>
      <p className={styles.commentBody}>{props.comment.body}</p>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

export default Comment;
