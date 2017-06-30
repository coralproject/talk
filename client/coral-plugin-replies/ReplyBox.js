import React, {Component, PropTypes} from 'react';
import CommentBox from '../coral-plugin-commentbox/CommentBox';

const name = 'coral-plugin-replies';

class ReplyBox extends Component {

  componentDidMount() {
    document.getElementById('replyText').focus();
  }

  cancelReply = () => {
    this.props.setActiveReplyBox('');
  };

  render() {
    const {
      styles,
      postComment,
      assetId,
      currentUser,
      addNotification,
      parentId,
      commentPostedHandler,
      maxCharCount,
      charCountEnable
    } = this.props;
    return <div className={`${name}-textarea`} style={styles && styles.container}>
      <CommentBox
        maxCharCount={maxCharCount}
        charCountEnable={charCountEnable}
        commentPostedHandler={commentPostedHandler}
        parentId={parentId}
        onCancel={this.cancelReply}
        addNotification={addNotification}
        currentUser={currentUser}
        assetId={assetId}
        postComment={postComment}
        isReply={true} />
    </div>;
  }
}

ReplyBox.propTypes = {
  charCountEnable: PropTypes.bool.isRequired,
  maxCharCount: PropTypes.number,
  setActiveReplyBox: PropTypes.func.isRequired,
  commentPostedHandler: PropTypes.func,
  parentId: PropTypes.string,
  addNotification: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  assetId: PropTypes.string.isRequired
};

export default ReplyBox;
