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

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
export const name = 'talk-plugin-commentbox';

/**
 * Container for posting a new Comment
 */
class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: '',
      input: {
        body: '',
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
      tags: this.props.tags,
      ...this.state.input,
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
        this.setState({ loadingState: 'success', input: { body: '' } });
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
    const { isReply, registerHook, unregisterHook } = this.props;
    return (
      <Slot
        fill="commentInputDetailArea"
        passthrough={{
          registerHook: registerHook,
          unregisterHook: unregisterHook,
          isReply,
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
  connect(mapStateToProps, null)
);

export default enhance(CommentBox);
