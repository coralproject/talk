import React from 'react';
import PropTypes from 'prop-types';
import t, { timeago } from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';
import { isSuspended } from 'coral-framework/utils/user';
import Slot from 'coral-framework/components/Slot';
import { connect } from 'react-redux';
import CommentForm from '../containers/CommentForm';
import { notifyForNewCommentStatus } from '../helpers';
import withHooks from '../hocs/withHooks';
import { compose } from 'recompose';
import once from 'lodash/once';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
export const name = 'talk-plugin-commentbox';

// @Deprecated
const showOldTagsWarningOnce = once(() => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Using `addTags` and `removeTags` is deprecated. Please switch to `onInputChange` and `input` instead'
    );
  }
});

const initialInput = { body: '', tags: [] };

/**
 * Container for posting a new Comment
 */
class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: '',
      input: initialInput,
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

    // @Deprecated
    const deprecatedTags = this.props.tags || [];
    if (deprecatedTags.length) {
      showOldTagsWarningOnce();
    }
    const tags = this.state.input.tags || [];

    let input = {
      asset_id: assetId,
      parent_id: parentId,
      ...this.state.input,
      tags: [...deprecatedTags, ...tags],
    };

    // Execute preSubmit Hooks
    this.props.forEachHook('preSubmit', hook => {
      const result = hook(input);
      if (result) {
        input = result;
      }
    });
    this.setState({ loadingState: 'loading' });

    postComment(input, 'comments')
      .then(({ data }) => {
        this.setState({ loadingState: 'success', input: initialInput });
        const postedComment = data.createComment.comment;
        const actions = data.createComment.actions;

        // Execute postSubmit Hooks
        this.props.forEachHook('postSubmit', hook =>
          hook(data, this.handleInputChange)
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

  handleInputChange = input => {
    this.setState(state => ({
      input: {
        ...state.input,
        ...input,
      },
    }));
  };

  renderButtonContainerStart() {
    const { root, isReply, registerHook, unregisterHook } = this.props;
    return (
      <Slot
        fill="commentInputDetailArea"
        passthrough={{
          root,
          registerHook: registerHook,
          unregisterHook: unregisterHook,
          isReply,
          input: this.state.input,
          onInputChange: this.handleInputChange,
        }}
        inline
      />
    );
  }

  render() {
    const {
      isReply,
      maxCharCount,
      assetId,
      parentId,
      comment,
      root,
      registerHook,
      unregisterHook,
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
          maxCharCount={maxCharCount}
          charCountEnable={this.props.charCountEnable}
          id={id}
          input={this.state.input}
          registerHook={registerHook}
          unregisterHook={unregisterHook}
          isReply={isReply}
          buttonContainerStart={this.renderButtonContainerStart()}
          onInputChange={this.handleInputChange}
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
  registerHook: PropTypes.func.isRequired,
  unregisterHook: PropTypes.func.isRequired,
  forEachHook: PropTypes.func.isRequired,
};

CommentBox.fragments = CommentForm.fragments;

const mapStateToProps = state => ({
  tags: state.stream.commentBoxTags,
});

const enhance = compose(
  withHooks(['preSubmit', 'postSubmit']),
  connect(
    mapStateToProps,
    null
  )
);

export default enhance(CommentBox);
