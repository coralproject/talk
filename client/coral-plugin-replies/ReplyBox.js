import React, {PropTypes} from 'react';
import CommentBox from '../coral-plugin-commentbox/CommentBox';

const name = 'coral-plugin-replies';

const ReplyBox = ({styles, postItem, assetId, authorId, addNotification, parentId, replyPostedHandler}) => (
  <div className={`${name}-textarea`} style={styles && styles.container}>
    <CommentBox
      replyPostedHandler={replyPostedHandler}
      parentId={parentId}
      addNotification={addNotification}
      authorId={authorId}
      assetId={assetId}
      postItem={postItem}
      isReply={true} />
  </div>
);

ReplyBox.propTypes = {
  replyPostedHandler: PropTypes.func,
  parentId: PropTypes.string,
  addNotification: PropTypes.func.isRequired,
  authorId: PropTypes.string.isRequired,
  postItem: PropTypes.func.isRequired,
  assetId: PropTypes.string.isRequired
};

export default ReplyBox;
