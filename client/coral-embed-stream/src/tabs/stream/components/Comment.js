import React from 'react';
import PropTypes from 'prop-types';

import TagLabel from './TagLabel';
import CommentTimestamp from 'coral-framework/components/CommentTimestamp';
import ReplyButton from './ReplyButton';
import ReplyBox from '../containers/ReplyBox';
import FlagComment from './FlagComment';
import { can } from 'coral-framework/services/perms';
import { TransitionGroup } from 'react-transition-group';
import cn from 'classnames';
import styles from './Comment.css';
import { THREADING_LEVEL } from '../../../constants/stream';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import LoadMore from './LoadMore';
import { getEditableUntilDate } from '../util';
import { findCommentWithId } from '../../../graphql/utils';
import CommentContent from 'coral-framework/components/CommentContent';
import Slot from 'coral-framework/components/Slot';
import CommentTombstone from './CommentTombstone';
import InactiveCommentLabel from './InactiveCommentLabel';
import EditableCommentContent from '../containers/EditableCommentContent';
import {
  getActionSummary,
  iPerformedThisAction,
  isCommentActive,
  isCommentDeleted,
  getShallowChanges,
} from 'coral-framework/utils';
import t from 'coral-framework/services/i18n';
import CommentContainer from '../containers/Comment';
import { CommentAuthorName } from 'coral-framework/components';
import { STAFF } from 'coral-framework/constants/roles';

const isStaff = tags => !tags.every(t => t.tag.name !== STAFF);
const hasTag = (tags, lookupTag) =>
  !!tags.filter(t => t.tag.name === lookupTag).length;
const hasComment = (nodes, id) => nodes.some(node => node.id === id);

// resetCursors will return the id cursors of the first and second newest comment in
// the current reply list. The cursors are used to dertermine which
// comments to show. The spare cursor functions as a backup in case one
// of the comments gets deleted.
function resetCursors(state, props) {
  const replies = props.comment.replies;
  if (replies && replies.nodes.length) {
    const idCursors = [replies.nodes[replies.nodes.length - 1].id];
    if (replies.nodes.length >= 2) {
      idCursors.push(replies.nodes[replies.nodes.length - 2].id);
    }
    return { idCursors };
  }
  return { idCursors: [] };
}

// invalidateCursor is called whenever a comment is removed which is referenced
// by one of the 2 id cursors. It returns a new set of id cursors calculated
// using the help of the backup cursor.
function invalidateCursor(invalidated, state, props) {
  const alt = invalidated === 1 ? 0 : 1;
  const replies = props.comment.replies;
  const idCursors = [];
  if (state.idCursors[alt]) {
    idCursors.push(state.idCursors[alt]);
    const index = replies.nodes.findIndex(node => node.id === idCursors[0]);
    const prevInLine = replies.nodes[index - 1];
    if (prevInLine) {
      idCursors.push(prevInLine.id);
    }
  }
  return { idCursors };
}

// hold actions links (e.g. Reply) along the comment footer
const ActionButton = ({ children }) => {
  return (
    <span className="comment__action-button comment__action-button--nowrap">
      {children}
    </span>
  );
};

ActionButton.propTypes = {
  // id of currently opened ReplyBox. tracked in Stream.js
  children: PropTypes.node,
};

// Determine whether the comment with id is in the part of the comments tree.
function containsCommentId(props, id) {
  if (props.comment.id === id) {
    return true;
  }
  if (props.comment.replies) {
    return findCommentWithId(props.comment.replies.nodes, id);
  }
  return false;
}

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    // timeout to keep track of Comment edit window expiration
    this.editWindowExpiryTimeout = null;
    this.onClickEdit = this.onClickEdit.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.state = {
      isEditable: commentIsStillEditable(props.comment),
      isEditing: false,
      replyBoxVisible: false,
      loadingState: '',
      ...resetCursors({}, props),
    };
  }

  componentWillReceiveProps(next) {
    const {
      comment: { replies: prevReplies },
    } = this.props;
    const {
      comment: { replies: nextReplies },
    } = next;
    if (
      prevReplies &&
      nextReplies &&
      nextReplies.nodes.length < prevReplies.nodes.length
    ) {
      // Invalidate first cursor if referenced comment was removed.
      if (
        this.state.idCursors[0] &&
        !hasComment(nextReplies.nodes, this.state.idCursors[0])
      ) {
        this.setState(invalidateCursor(0, this.state, next));
      }

      // Invalidate second cursor if referenced comment was removed.
      if (
        this.state.idCursors[1] &&
        !hasComment(nextReplies.nodes, this.state.idCursors[1])
      ) {
        this.setState(invalidateCursor(1, this.state, next));
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Specifically handle `activeReplyBox` if it is the only change.
    const changes = [
      ...getShallowChanges(this.props, nextProps),
      ...getShallowChanges(this.state, nextState),
    ];
    if (changes.length === 1 && changes[0] === 'activeReplyBox') {
      if (
        !containsCommentId(this.props, this.props.activeReplyBox) &&
        !containsCommentId(nextProps, nextProps.activeReplyBox)
      ) {
        return false;
      }
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  static propTypes = {
    // id of currently opened ReplyBox. tracked in Stream.js
    children: PropTypes.node,
    activeReplyBox: PropTypes.string.isRequired,
    disableReply: PropTypes.bool,
    setActiveReplyBox: PropTypes.func.isRequired,
    showSignInDialog: PropTypes.func.isRequired,
    postFlag: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
    parentId: PropTypes.string,
    highlighted: PropTypes.object,
    notify: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
    depth: PropTypes.number.isRequired,
    liveUpdates: PropTypes.bool,
    asset: PropTypes.object.isRequired,
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    charCountEnable: PropTypes.bool.isRequired,
    maxCharCount: PropTypes.number,
    root: PropTypes.object,
    loadMore: PropTypes.func,
    postDontAgree: PropTypes.func.isRequired,
    animateEnter: PropTypes.bool,
    commentClassNames: PropTypes.array,
    comment: PropTypes.object.isRequired,
    setCommentStatus: PropTypes.func.isRequired,

    // edit a comment, passed (id, asset_id, { body })
    editComment: PropTypes.func,

    // emit custom events
    emit: PropTypes.func.isRequired,
  };

  editComment = (...args) => {
    return this.props.editComment(
      this.props.comment.id,
      this.props.asset.id,
      ...args
    );
  };

  onClickEdit(e) {
    e.preventDefault();
    if (!can(this.props.currentUser, 'INTERACT_WITH_COMMUNITY')) {
      this.props.notify('error', t('error.NOT_AUTHORIZED'));
      return;
    }
    this.setState({ isEditing: true });
  }

  stopEditing() {
    if (this._isMounted) {
      this.setState({ isEditing: false });
    }
  }

  commentIsRejected(comment) {
    return comment.status === 'REJECTED';
  }

  commentIsIgnored(comment) {
    const me = this.props.root.me;
    return (
      me &&
      me.ignoredUsers &&
      me.ignoredUsers.find(u => u.id === comment.user.id)
    );
  }

  hasIgnoredReplies() {
    return (
      this.props.comment.replies &&
      this.props.comment.replies.nodes.some(reply =>
        this.commentIsIgnored(reply)
      )
    );
  }

  loadNewReplies = () => {
    const {
      comment: { replies, replyCount, id },
      emit,
    } = this.props;
    if (replyCount > replies.nodes.length) {
      this.setState({ loadingState: 'loading' });
      this.props
        .loadMore(id)
        .then(() => {
          this.setState({
            ...resetCursors(this.state, this.props),
            loadingState: 'success',
          });
        })
        .catch(() => {
          this.setState({ loadingState: 'error' });
        });
      emit('ui.Comment.showMoreReplies', { id });
      return;
    }
    this.setState(resetCursors);
    emit('ui.Comment.showMoreReplies', { id });
  };

  showReplyBox = () => {
    if (!this.props.currentUser) {
      this.props.showSignInDialog();
      return;
    }
    if (can(this.props.currentUser, 'INTERACT_WITH_COMMUNITY')) {
      this.props.setActiveReplyBox(this.props.comment.id);
    } else {
      this.props.notify('error', t('error.NOT_AUTHORIZED'));
    }
    return;
  };

  commentPostedHandler = () => {
    this.props.setActiveReplyBox('');
  };

  undoStatus = () =>
    this.props.setCommentStatus({
      commentId: this.props.comment.id,
      status: this.props.comment.status_history[
        this.props.comment.status_history.length - 2
      ].type,
    });

  // getVisibileReplies returns a list containing comments
  // which were authored by current user or comes before the `idCursor`.
  getVisibileReplies() {
    const {
      comment: { replies },
      currentUser,
      liveUpdates,
    } = this.props;
    const idCursor = this.state.idCursors[0];
    const userId = currentUser ? currentUser.id : null;

    if (!replies) {
      return [];
    }

    if (liveUpdates) {
      return replies.nodes;
    }

    const view = [];
    let pastCursor = false;
    replies.nodes.forEach(comment => {
      if ((idCursor && !pastCursor) || comment.user.id === userId) {
        view.push(comment);
      }
      if (comment.id === idCursor) {
        pastCursor = true;
      }
    });
    return view;
  }

  /**
   * getConditionalClassNames
   * conditionalClassNames adds classNames based on condition
   * classnames is an array of objects with key as classnames and value as conditions
   * i.e:
   * {
   *  'myClassName': { tags: [STAFF]}
   * }
   *
   * This will add myClassName to comments tagged with STAFF TAG.
   **/
  getConditionalClassNames() {
    const { commentClassNames = [] } = this.props;
    return mapValues(merge({}, ...commentClassNames), condition => {
      if (condition.tags) {
        return condition.tags.some(tag => hasTag(this.props.comment.tags, tag));
      }
      return false;
    });
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.editWindowExpiryTimeout) {
      this.editWindowExpiryTimeout = clearTimeout(this.editWindowExpiryTimeout);
    }

    // if still in the edit window, set a timeout to handle expiration.
    if (this.state.isEditable) {
      const msLeftToEdit = editWindowRemainingMs(this.props.comment);
      this.editWindowExpiryTimeout = setTimeout(() => {
        this.setState({ isEditable: false });
      }, Math.max(msLeftToEdit, 0));
    }
  }

  componentWillUnmount() {
    if (this.editWindowExpiryTimeout) {
      this.editWindowExpiryTimeout = clearTimeout(this.editWindowExpiryTimeout);
    }
    this._isMounted = false;
  }

  renderReplyBox() {
    const {
      asset,
      depth,
      comment,
      parentId,
      postComment,
      currentUser,
      setActiveReplyBox,
      maxCharCount,
      notify,
      charCountEnable,
      root,
    } = this.props;
    return (
      <ReplyBox
        root={root}
        comment={comment}
        commentPostedHandler={this.commentPostedHandler}
        charCountEnable={charCountEnable}
        maxCharCount={maxCharCount}
        setActiveReplyBox={setActiveReplyBox}
        parentId={depth < THREADING_LEVEL ? comment.id : parentId}
        notify={notify}
        postComment={postComment}
        currentUser={currentUser}
        assetId={asset.id}
      />
    );
  }

  renderReplies(view) {
    const {
      asset,
      depth,
      comment,
      postFlag,
      highlighted,
      postComment,
      currentUser,
      setActiveReplyBox,
      activeReplyBox,
      loadMore,
      deleteAction,
      disableReply,
      maxCharCount,
      notify,
      charCountEnable,
      showSignInDialog,
      liveUpdates,
      postDontAgree,
      emit,
    } = this.props;
    return (
      <TransitionGroup key="transitionGroup">
        {view.map(reply => {
          return (
            <CommentContainer
              root={this.props.root}
              setActiveReplyBox={setActiveReplyBox}
              disableReply={disableReply}
              activeReplyBox={activeReplyBox}
              notify={notify}
              parentId={comment.id}
              postComment={postComment}
              editComment={this.props.editComment}
              depth={depth + 1}
              asset={asset}
              highlighted={highlighted}
              currentUser={currentUser}
              postFlag={postFlag}
              deleteAction={deleteAction}
              loadMore={loadMore}
              charCountEnable={charCountEnable}
              maxCharCount={maxCharCount}
              showSignInDialog={showSignInDialog}
              liveUpdates={liveUpdates}
              reactKey={reply.id}
              key={reply.id}
              comment={reply}
              emit={emit}
              postDontAgree={postDontAgree}
            />
          );
        })}
      </TransitionGroup>
    );
  }

  renderLoadMoreReplies(view) {
    const { comment } = this.props;
    const { loadingState } = this.state;
    const hasMoreComments =
      comment.replies &&
      (comment.replies.hasNextPage ||
        comment.replies.nodes.length > view.length);
    const moreRepliesCount = this.hasIgnoredReplies()
      ? -1
      : comment.replyCount - view.length;
    return (
      <div className="talk-load-more-replies" key="loadMoreReplies">
        <LoadMore
          topLevel={false}
          replyCount={moreRepliesCount}
          moreComments={hasMoreComments}
          loadMore={this.loadNewReplies}
          loadingState={loadingState}
        />
      </div>
    );
  }

  renderRepliesContainer() {
    const { highlighted, comment } = this.props;

    // Only render highlighted reply when we are the parent of it.
    if (get(highlighted, 'parent.id') === comment.id) {
      return this.renderReplies([highlighted]);
    }

    // Otherwise render replies in current view and a load more button if needed.
    const view = this.getVisibileReplies();
    return [this.renderReplies(view), this.renderLoadMoreReplies(view)];
  }

  renderComment() {
    const {
      asset,
      root,
      depth,
      comment,
      postFlag,
      parentId,
      highlighted,
      currentUser,
      postDontAgree,
      deleteAction,
      disableReply,
      maxCharCount,
      notify,
      charCountEnable,
      showSignInDialog,
    } = this.props;

    // Inactive comments can be viewed by moderators and admins (e.g. using permalinks).
    const isActive = isCommentActive(comment.status);

    const isPending = comment.id.indexOf('pending') >= 0;
    const isHighlighted = highlighted && highlighted.id === comment.id;
    const flagSummary = getActionSummary('FlagActionSummary', comment);
    const dontAgreeSummary = getActionSummary(
      'DontAgreeActionSummary',
      comment
    );
    let myFlag = null;
    if (iPerformedThisAction('FlagActionSummary', comment)) {
      myFlag = flagSummary.find(s => s.current_user);
    } else if (iPerformedThisAction('DontAgreeActionSummary', comment)) {
      myFlag = dontAgreeSummary.find(s => s.current_user);
    }

    const commentClassName = cn(
      'talk-stream-comment',
      `talk-stream-comment-level-${depth}`,
      styles.comment,
      styles[`commentLevel${depth}`],
      {
        [styles.pendingComment]: isPending,
        [styles.highlightedComment]: isHighlighted,
        'talk-stream-pending-comment': isPending,
        'talk-stream-highlighted-comment': isHighlighted,
      }
    );

    // props that are passed down the slots.
    const slotPassthrough = {
      depth,
      root,
      asset,
      comment,
    };

    return (
      <div className={commentClassName}>
        <Slot
          className={cn(styles.commentAvatar, 'talk-stream-comment-avatar')}
          fill="commentAvatar"
          passthrough={slotPassthrough}
          inline
        />

        <div
          className={cn(
            styles.commentContainer,
            'talk-stream-comment-container'
          )}
        >
          <div className={cn(styles.header, 'talk-stream-comment-header')}>
            <div
              className={cn(
                styles.headerContainer,
                'talk-stream-comment-header-container'
              )}
            >
              <Slot
                className={cn(styles.username, 'talk-stream-comment-user-name')}
                fill="commentAuthorName"
                defaultComponent={CommentAuthorName}
                passthrough={slotPassthrough}
              />

              <div
                className={cn(
                  styles.tagsContainer,
                  'talk-stream-comment-header-tags-container'
                )}
              >
                {isStaff(comment.tags) ? (
                  <TagLabel>{t('community.staff')}</TagLabel>
                ) : null}

                <Slot
                  className={cn(
                    styles.commentAuthorTagsSlot,
                    'talk-stream-comment-author-tags'
                  )}
                  fill="commentAuthorTags"
                  passthrough={slotPassthrough}
                  inline
                />
              </div>

              <span
                className={cn(
                  styles.bylineSecondary,
                  'talk-stream-comment-user-byline'
                )}
              >
                <Slot
                  fill="commentTimestamp"
                  defaultComponent={CommentTimestamp}
                  className={'talk-stream-comment-published-date'}
                  passthrough={{
                    created_at: comment.created_at,
                    ...slotPassthrough,
                  }}
                />
                {comment.editing && comment.editing.edited ? (
                  <span>
                    &nbsp;<span className={styles.editedMarker}>
                      ({t('comment.edited')})
                    </span>
                  </span>
                ) : null}
              </span>
            </div>

            <Slot
              className={styles.commentInfoBar}
              fill="commentInfoBar"
              passthrough={slotPassthrough}
            />

            {isActive &&
              (currentUser && comment.user.id === currentUser.id) && (
                /* User can edit/delete their own comment for a short window after posting */
                <span className={cn(styles.topRight)}>
                  {this.state.isEditable && (
                    <a
                      className={cn(styles.link, {
                        [styles.active]: this.state.isEditing,
                      })}
                      onClick={this.onClickEdit}
                    >
                      {t('framework.edit')}
                    </a>
                  )}
                </span>
              )}
            {!isActive && <InactiveCommentLabel status={comment.status} />}
          </div>
          <div className={styles.content}>
            {this.state.isEditing ? (
              <EditableCommentContent
                editComment={this.editComment}
                notify={notify}
                root={root}
                comment={comment}
                currentUser={currentUser}
                charCountEnable={charCountEnable}
                maxCharCount={maxCharCount}
                parentId={parentId}
                stopEditing={this.stopEditing}
              />
            ) : (
              <div>
                <Slot
                  fill="commentContent"
                  className="talk-stream-comment-content"
                  defaultComponent={CommentContent}
                  size={1}
                  passthrough={slotPassthrough}
                />
              </div>
            )}
          </div>
          <div className={cn(styles.footer, 'talk-stream-comment-footer')}>
            {isActive && (
              <div className={'talk-stream-comment-actions-container'}>
                <div className="talk-embed-stream-comment-actions-container-left commentActionsLeft comment__action-container">
                  <Slot
                    fill="commentReactions"
                    passthrough={slotPassthrough}
                    inline
                  />

                  {!disableReply && (
                    <ActionButton>
                      <ReplyButton
                        onClick={this.showReplyBox}
                        parentCommentId={parentId || comment.id}
                        currentUserId={currentUser && currentUser.id}
                      />
                    </ActionButton>
                  )}
                </div>
                <div className="talk-embed-stream-comment-actions-container-right commentActionsRight comment__action-container">
                  <Slot
                    fill="commentActions"
                    passthrough={slotPassthrough}
                    inline
                  />
                  <ActionButton>
                    <FlagComment
                      flaggedByCurrentUser={!!myFlag}
                      flag={myFlag}
                      id={comment.id}
                      author_id={comment.user.id}
                      postFlag={postFlag}
                      notify={notify}
                      postDontAgree={postDontAgree}
                      deleteAction={deleteAction}
                      showSignInDialog={showSignInDialog}
                      currentUser={currentUser}
                    />
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      depth,
      comment,
      activeReplyBox,
      highlighted,
      animateEnter,
    } = this.props;

    if (!highlighted && this.commentIsRejected(comment)) {
      return <CommentTombstone action="reject" onUndo={this.undoStatus} />;
    }

    if (this.commentIsIgnored(comment)) {
      return <CommentTombstone action="ignore" />;
    }

    const rootClassName = cn(
      'talk-stream-comment-wrapper',
      `talk-stream-comment-wrapper-level-${depth}`,
      styles.root,
      styles[`rootLevel${depth}`],
      {
        ...this.getConditionalClassNames(),
        [styles.enter]: animateEnter,
      }
    );

    const id = `c_${comment.id}`;

    // props that are passed down the slots.
    const slotPassthrough = {
      action: 'deleted',
      comment,
    };

    return (
      <div className={rootClassName} id={id}>
        {isCommentDeleted(comment) ? (
          <Slot
            fill="commentTombstone"
            defaultComponent={CommentTombstone}
            size={1}
            passthrough={slotPassthrough}
          />
        ) : (
          <div>
            {this.renderComment()}
            {activeReplyBox === comment.id && this.renderReplyBox()}
          </div>
        )}
        {this.renderRepliesContainer()}
      </div>
    );
  }
}

// return whether the comment is editable
function commentIsStillEditable(comment) {
  const editing = comment && comment.editing;
  if (!editing) {
    return false;
  }
  const editableUntil = getEditableUntilDate(comment);
  const editWindowExpired = editableUntil - new Date() < 0;
  return !editWindowExpired;
}

// return number of milliseconds before edit window expires
function editWindowRemainingMs(comment) {
  const editableUntil = getEditableUntilDate(comment);
  if (!editableUntil) {
    return;
  }
  const now = new Date();
  const editWindowRemainingMs = editableUntil - now;
  return editWindowRemainingMs;
}
