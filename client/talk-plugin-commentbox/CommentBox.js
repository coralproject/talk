import React from 'react';
import PropTypes from 'prop-types';

import t from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';
import { forEachError } from 'coral-framework/utils';

import Slot from 'coral-framework/components/Slot';
import { connect } from 'react-redux';
import { CommentForm } from './CommentForm';

export const name = 'talk-plugin-commentbox';

const notifyReasons = ['LINKS', 'TRUST'];

function shouldNotify(actions = []) {
  return actions.some(
    ({ __typename, reason }) =>
      __typename === 'FlagAction' && notifyReasons.includes(reason)
  );
}

// Given a newly posted comment's status, show a notification to the user
// if needed
export const notifyForNewCommentStatus = (notify, comment, actions) => {
  if (comment.status === 'REJECTED') {
    notify('error', t('comment_box.comment_post_banned_word'));
  } else if (
    comment.status === 'PREMOD' ||
    (comment.status === 'SYSTEM_WITHHELD' && shouldNotify(actions))
  ) {
    notify('success', t('comment_box.comment_post_notif_premod'));
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
      body: '',
      loadingState: '',

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

    if (!can(currentUser, 'INTERACT_WITH_COMMUNITY')) {
      notify('error', t('error.NOT_AUTHORIZED'));
      return;
    }

    let input = {
      asset_id: assetId,
      parent_id: parentId,
      body: this.state.body,
      ...this.props.commentBox,
    };

    // Execute preSubmit Hooks
    this.state.hooks.preSubmit.forEach(hook => hook(input));
    this.setState({ loadingState: 'loading' });

    postComment(input, 'comments')
      .then(({ data }) => {
        this.setState({ loadingState: 'success', body: '' });
        const postedComment = data.createComment.comment;
        const actions = data.createComment.actions;

        // Execute postSubmit Hooks
        this.state.hooks.postSubmit.forEach(hook => hook(data));

        notifyForNewCommentStatus(notify, postedComment, actions);

        if (commentPostedHandler) {
          commentPostedHandler();
        }
      })
      .catch(err => {
        this.setState({ loadingState: 'error' });
        forEachError(err, ({ msg }) => notify('error', msg));
      });
  };

  handleBodyChange = body => {
    this.setState({ body });
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
    const { isReply, maxCharCount } = this.props;
    let { onCancel } = this.props;

    if (isReply && typeof onCancel !== 'function') {
      console.warn(
        'the CommentBox component should have a onCancel callback defined if it lives in a Reply'
      );
      onCancel = () => {};
    }

    return (
      <div>
        <CommentForm
          defaultValue={this.props.defaultValue}
          bodyLabel={isReply ? t('comment_box.reply') : t('comment.comment')}
          maxCharCount={maxCharCount}
          charCountEnable={this.props.charCountEnable}
          bodyPlaceholder={t('comment.comment')}
          bodyInputId={isReply ? 'replyText' : 'commentText'}
          body={this.state.body}
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
  commentBox: PropTypes.object,
};

const mapStateToProps = ({ commentBox }) => ({ commentBox });

export default connect(mapStateToProps, null)(CommentBox);
