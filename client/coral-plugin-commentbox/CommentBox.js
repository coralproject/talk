import React, {PropTypes} from 'react';

import t from 'coral-framework/services/i18n';

import Slot from 'coral-framework/components/Slot';
import {connect} from 'react-redux';
import {CommentForm} from './CommentForm';

export const name = 'coral-plugin-commentbox';

// Given a newly posted comment's status, show a notification to the user
// if needed
export const notifyForNewCommentStatus = (addNotification, status) => {
  if (status === 'REJECTED') {
    addNotification('error', t('comment_box.comment_post_banned_word'));
  } else if (status === 'PREMOD') {
    addNotification('success', t('comment_box.comment_post_notif_premod'));
  }
};

/**
 * Container for posting a new Comment
 */
class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',

      // incremented on successful post to clear form
      postedCount: 0,
      hooks: {
        preSubmit: [],
        postSubmit: []
      }
    };
  }
  static get defaultProps() {
    return {
      setCommentCountCache: () => {}
    };
  }
  postComment = ({body}) => {
    const {
      commentPostedHandler,
      postComment,
      setCommentCountCache,
      commentCountCache,
      isReply,
      assetId,
      parentId,
      addNotification,
    } = this.props;

    let comment = {
      asset_id: assetId,
      parent_id: parentId,
      body,
      ...this.props.commentBox
    };

    !isReply && setCommentCountCache(commentCountCache + 1);

    // Execute preSubmit Hooks
    this.state.hooks.preSubmit.forEach((hook) => hook());

    postComment(comment, 'comments')
      .then(({data}) => {
        const postedComment = data.createComment.comment;

        // Execute postSubmit Hooks
        this.state.hooks.postSubmit.forEach((hook) => hook(data));

        notifyForNewCommentStatus(addNotification, postedComment.status);

        if (postedComment.status === 'REJECTED') {
          !isReply && setCommentCountCache(commentCountCache);
        } else if (postedComment.status === 'PREMOD') {
          !isReply && setCommentCountCache(commentCountCache);
        }

        if (commentPostedHandler) {
          commentPostedHandler();
        }
      })
      .catch((err) => {
        console.error(err);
        !isReply && setCommentCountCache(commentCountCache);
      });

    this.setState({postedCount: this.state.postedCount + 1});
  }

  registerHook = (hookType = '', hook = () => {}) => {
    if (typeof hook !== 'function') {
      return console.warn(`Hooks must be functions. Please check your ${hookType} hooks`);
    } else if (typeof hookType === 'string') {
      this.setState((state) => ({
        hooks: {
          ...state.hooks,
          [hookType]: [
            ...state.hooks[hookType],
            hook
          ]
        }
      }));

      return {
        hookType,
        hook
      };

    } else {
      return console.warn('hookTypes must be a string. Please check your hooks');
    }
  }

  unregisterHook = (hookData) => {
    const {hookType, hook} = hookData;

    this.setState((state) => {
      let newHooks = state.hooks[newHooks];
      const idx = state.hooks[hookType].indexOf(hook);

      if (idx !== -1) {
        newHooks = [
          ...state.hooks[hookType].slice(0, idx),
          ...state.hooks[hookType].slice(idx + 1)
        ];
      }

      return {
        hooks: {
          ...state.hooks,
          [hookType]: newHooks
        }
      };

    });
  }

  handleChange = (e) => this.setState({body: e.target.value});

  render () {
    const {styles, isReply, authorId, maxCharCount} = this.props;
    let {cancelButtonClicked} = this.props;

    if (isReply && typeof cancelButtonClicked !== 'function') {
      console.warn('the CommentBox component should have a cancelButtonClicked callback defined if it lives in a Reply');
      cancelButtonClicked = () => {};
    }

    return <div>
      <CommentForm
        styles={styles}
        key={this.state.postedCount}
        defaultValue={this.props.defaultValue}
        bodyInputId={isReply ? 'replyText' : 'commentText'}
        bodyLabel={isReply ? t('comment_box.reply') : t('comment.comment')}
        maxCharCount={maxCharCount}
        charCountEnable={this.props.charCountEnable}
        bodyPlaceholder={t('comment.comment')}
        bodyInputId={isReply ? 'replyText' : 'commentText'}
        saveComment={authorId && this.postComment}
        buttonContainerStart={<Slot
          fill="commentInputDetailArea"
          registerHook={this.registerHook}
          unregisterHook={this.unregisterHook}
          isReply={isReply}
          inline
        />}
        cancelButtonClicked={cancelButtonClicked}
      />
    </div>;
  }
}

CommentBox.propTypes = {

  // Initial value for underlying comment body textarea
  defaultValue: PropTypes.string,
  charCountEnable: PropTypes.bool.isRequired,
  maxCharCount: PropTypes.number,
  commentPostedHandler: PropTypes.func,
  postComment: PropTypes.func.isRequired,
  cancelButtonClicked: PropTypes.func,
  assetId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  authorId: PropTypes.string.isRequired,
  isReply: PropTypes.bool.isRequired,
  canPost: PropTypes.bool,
  setCommentCountCache: PropTypes.func,
};

const mapStateToProps = ({commentBox}) => ({commentBox});

export default connect(mapStateToProps, null)(CommentBox);
