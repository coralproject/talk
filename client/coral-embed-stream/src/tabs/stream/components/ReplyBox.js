import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import CommentBox from '../containers/CommentBox';
import styles from './ReplyBox.css';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
const name = 'talk-plugin-replies';

class ReplyBox extends React.Component {
  componentDidMount() {
    // TODO: (kiwi) This does not follow best practices, better to move this logic into the component.
    document.getElementById(`comment-draft_${this.props.parentId}`).focus();
  }

  cancelReply = () => {
    this.props.setActiveReplyBox('');
  };

  render() {
    const {
      postComment,
      assetId,
      currentUser,
      notify,
      parentId,
      commentPostedHandler,
      maxCharCount,
      charCountEnable,
      comment,
      root,
    } = this.props;
    return (
      <div className={cn(styles.container, `${name}-textarea`)}>
        <CommentBox
          root={root}
          comment={comment}
          maxCharCount={maxCharCount}
          charCountEnable={charCountEnable}
          commentPostedHandler={commentPostedHandler}
          parentId={parentId}
          onCancel={this.cancelReply}
          notify={notify}
          currentUser={currentUser}
          assetId={assetId}
          postComment={postComment}
          isReply={true}
        />
      </div>
    );
  }
}

ReplyBox.propTypes = {
  charCountEnable: PropTypes.bool.isRequired,
  maxCharCount: PropTypes.number,
  setActiveReplyBox: PropTypes.func.isRequired,
  commentPostedHandler: PropTypes.func,
  parentId: PropTypes.string,
  notify: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  assetId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  styles: PropTypes.object,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object,
};

export default ReplyBox;
