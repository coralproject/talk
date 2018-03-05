import React from 'react';
import PropTypes from 'prop-types';
import t, { timeago } from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';
import { isSuspended } from 'coral-framework/utils/user';
import Slot from 'coral-framework/components/Slot';
import { connect } from 'react-redux';
import CommentForm from '../containers/CommentForm';
import { notifyForNewCommentStatus } from '../helpers';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
export const name = 'talk-plugin-commentbox';

/**
 * Container for posting a new Comment
 */
class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
      loadingState: '',
      // data: {@object} contains data that might be useful for plugins
      data: {},
      hooks: {
        preSubmit: [],
        postSubmit: [],
      },
    };
  }

  handleSubmit = () => {
    const {
      commentPostedHandler,
      postComment,
      assetId,
      parentId,
      notify,
      currentUser,
    } = this.props;

    if (isSuspended(currentUser)) {
      notify(
        'error',
        t(
          'error.temporarily_suspended',
          timeago(currentUser.status.suspension.until)
        )
      );
      return;
    }

    if (!can(currentUser, 'INTERACT_WITH_COMMUNITY')) {
      notify('error', t('error.NOT_AUTHORIZED'));
      return;
    }

    let input = {
      asset_id: assetId,
      parent_id: parentId,
      body: this.state.body,
      tags: this.props.tags,
      ...this.state.data,
    };

    // Execute preSubmit Hooks
    this.state.hooks.preSubmit.forEach(hook =>
      hook(input, this.handleBodyChange)
    );
    this.setState({ loadingState: 'loading' });

    postComment(input, 'comments')
      .then(({ data }) => {
        this.setState({ loadingState: 'success', body: '' });
        const postedComment = data.createComment.comment;
        const actions = data.createComment.actions;

        // Execute postSubmit Hooks
        this.state.hooks.postSubmit.forEach(hook =>
          hook(data, this.handleBodyChange)
        );

        notifyForNewCommentStatus(notify, postedComment.status, actions);

        if (commentPostedHandler) {
          commentPostedHandler();
        }
      })
      .catch(() => {
        this.setState({ loadingState: 'error' });
      });
  };

  handleBodyChange = (body, data) => {
    this.setState(state => ({
      body,
      data: {
        ...state.data,
        ...data,
      },
    }));
  };

  registerHook = (hookType = '', hook = () => {}) => {
    if (typeof hook !== 'function') {
      return console.warn(
        `Hooks must be functions. Please check your ${hookType} hooks`
      );
    } else if (typeof hookType === 'string') {
      this.setState(state => ({
        hooks: {
          ...state.hooks,
          [hookType]: [...state.hooks[hookType], hook],
        },
      }));

      return {
        hookType,
        hook,
      };
    } else {
      return console.warn(
        'hookTypes must be a string. Please check your hooks'
      );
    }
  };

  unregisterHook = hookData => {
    const { hookType, hook } = hookData;

    this.setState(state => {
      let newHooks = state.hooks[newHooks];
      const idx = state.hooks[hookType].indexOf(hook);

      if (idx !== -1) {
        newHooks = [
          ...state.hooks[hookType].slice(0, idx),
          ...state.hooks[hookType].slice(idx + 1),
        ];
      }

      return {
        hooks: {
          ...state.hooks,
          [hookType]: newHooks,
        },
      };
    });
  };

  render() {
    const {
      isReply,
      maxCharCount,
      assetId,
      parentId,
      comment,
      root,
    } = this.props;
    let { onCancel } = this.props;

    if (isReply && typeof onCancel !== 'function') {
      console.warn(
        'the CommentBox component should have a onCancel callback defined if it lives in a Reply'
      );
      onCancel = () => {};
    }

    // Generate id for the DraftArea.
    const id = parentId
      ? `comment-draft_${parentId}`
      : `comment-draft_${assetId}`;

    return (
      <div>
        <CommentForm
          root={root}
          comment={comment}
          defaultValue={this.props.defaultValue}
          bodyLabel={isReply ? t('comment_box.reply') : t('comment.comment')}
          maxCharCount={maxCharCount}
          charCountEnable={this.props.charCountEnable}
          bodyPlaceholder={t('comment.comment')}
          bodyInputId={id}
          body={this.state.body}
          registerHook={this.registerHook}
          unregisterHook={this.unregisterHook}
          isReply={isReply}
          buttonContainerStart={
            <Slot
              fill="commentInputDetailArea"
              registerHook={this.registerHook}
              unregisterHook={this.unregisterHook}
              isReply={isReply}
              inline
            />
          }
          onBodyChange={this.handleBodyChange}
          loadingState={this.state.loadingState}
          onCancel={onCancel}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

CommentBox.propTypes = {
  // Initial value for underlying comment body textarea
  defaultValue: PropTypes.string,
  charCountEnable: PropTypes.bool.isRequired,
  maxCharCount: PropTypes.number,
  commentPostedHandler: PropTypes.func,
  postComment: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  assetId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  isReply: PropTypes.bool.isRequired,
  canPost: PropTypes.bool,
  notify: PropTypes.func.isRequired,
  tags: PropTypes.array,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object,
};

CommentBox.fragments = CommentForm.fragments;

const mapStateToProps = state => ({
  tags: state.stream.commentBoxTags,
});

export default connect(mapStateToProps, null)(CommentBox);
