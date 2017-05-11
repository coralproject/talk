import React, {PropTypes} from 'react';
import PermalinkButton from 'coral-plugin-permalinks/PermalinkButton';

import AuthorName from 'coral-plugin-author-name/AuthorName';

import TagLabel from 'coral-plugin-tag-label/TagLabel';
import Content from 'coral-plugin-commentcontent/CommentContent';
import PubDate from 'coral-plugin-pubdate/PubDate';
import {ReplyBox, ReplyButton} from 'coral-plugin-replies';
import FlagComment from 'coral-plugin-flags/FlagComment';
import {
  BestButton,
  IfUserCanModifyBest,
  BEST_TAG,
  commentIsBest,
  BestIndicator
} from 'coral-plugin-best/BestButton';
import Slot from 'coral-framework/components/Slot';
import LoadMore from './LoadMore';
import IgnoredCommentTombstone from './IgnoredCommentTombstone';
import {TopRightMenu} from './TopRightMenu';
import classnames from 'classnames';
import {EditableCommentContent} from './EditableCommentContent';
import {getActionSummary, iPerformedThisAction} from 'coral-framework/utils';
import {getEditableUntilDate} from './util';
import styles from './Comment.css';

const isStaff = tags => !tags.every(t => t.name !== 'STAFF');

// hold actions links (e.g. Reply) along the comment footer
const ActionButton = ({children}) => {
  return (
    <span className="comment__action-button comment__action-button--nowrap">
      {children}
    </span>
  );
};

class Comment extends React.Component {
  constructor(props) {
    super(props);

    // timeout to keep track of Comment edit window expiration
    this.editWindowExpiryTimeout = null;
    this.onClickEdit = this.onClickEdit.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.state = {

      // Whether the comment should be editable (e.g. after a commenter clicking the 'Edit' button on their own comment)
      isEditing: false,
      replyBoxVisible: false,
    };
  }

  static propTypes = {
    reactKey: PropTypes.string.isRequired,

    // id of currently opened ReplyBox. tracked in Stream.js
    activeReplyBox: PropTypes.string.isRequired,
    disableReply: PropTypes.bool,
    setActiveReplyBox: PropTypes.func.isRequired,
    showSignInDialog: PropTypes.func.isRequired,
    postFlag: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
    parentId: PropTypes.string,
    highlighted: PropTypes.string,
    addNotification: PropTypes.func.isRequired,
    postItem: PropTypes.func.isRequired,
    depth: PropTypes.number.isRequired,
    asset: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string
    }).isRequired,
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    charCountEnable: PropTypes.bool.isRequired,
    maxCharCount: PropTypes.number,
    comment: PropTypes.shape({
      depth: PropTypes.number,
      action_summaries: PropTypes.array.isRequired,
      body: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string
        })
      ),
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired
        })
      ),
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired,
      editing: PropTypes.shape({
        edited: PropTypes.bool,

        // ISO8601
        editableUntil: PropTypes.string,
      })
    }).isRequired,

    // given a comment, return whether it should be rendered as ignored
    commentIsIgnored: React.PropTypes.func,

    // dispatch action to add a tag to a comment
    addCommentTag: React.PropTypes.func,

    // dispatch action to remove a tag from a comment
    removeCommentTag: React.PropTypes.func,

    // dispatch action to ignore another user
    ignoreUser: React.PropTypes.func,

    // edit a comment, passed (id, asset_id, { body })
    editComment: React.PropTypes.func,
  }

  onClickEdit (e) {
    e.preventDefault();
    this.setState({isEditing: true});
  }

  stopEditing () {
    if (this._isMounted) {
      this.setState({isEditing: false});
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.editWindowExpiryTimeout) {
      this.editWindowExpiryTimeout = clearTimeout(this.editWindowExpiryTimeout);
    }

    // if still in the edit window, set a timeout to re-render once it expires
    const msLeftToEdit = editWindowRemainingMs(this.props.comment);
    if (msLeftToEdit > 0) {
      this.editWindowExpiryTimeout = setTimeout(() => {

        // re-render
        this.setState(this.state);
      }, msLeftToEdit);      
    }
  }
  componentWillUnmount() {
    if (this.editWindowExpiryTimeout) {
      this.editWindowExpiryTimeout = clearTimeout(this.editWindowExpiryTimeout);
    }
    this._isMounted = false;
  }
  render () {
    const {
      comment,
      parentId,
      currentUser,
      asset,
      depth,
      postItem,
      addNotification,
      showSignInDialog,
      highlighted,
      postFlag,
      postDontAgree,
      loadMore,
      setActiveReplyBox,
      activeReplyBox,
      deleteAction,
      addCommentTag,
      removeCommentTag,
      ignoreUser,
      disableReply,
      commentIsIgnored,
      maxCharCount,
      charCountEnable
    } = this.props;

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

    let commentClass = parentId
      ? `reply ${styles.Reply}`
      : `comment ${styles.Comment}`;
    commentClass += comment.id === 'pending' ? ` ${styles.pendingComment}` : '';

    // call a function, and if it errors, call addNotification('error', ...) (e.g. to show user a snackbar)
    const notifyOnError = (fn, errorToMessage) =>
      async function(...args) {
        if (typeof errorToMessage !== 'function') {
          errorToMessage = error => error.message;
        }
        try {
          return await fn(...args);
        } catch (error) {
          addNotification('error', errorToMessage(error));
          throw error;
        }
      };

    const addBestTag = notifyOnError(
      () =>
        addCommentTag({
          id: comment.id,
          tag: BEST_TAG
        }),
      () => 'Failed to tag comment as best'
    );

    const removeBestTag = notifyOnError(
      () =>
        removeCommentTag({
          id: comment.id,
          tag: BEST_TAG
        }),
      () => 'Failed to remove best comment tag'
    );

    return (
      <div
        className={commentClass}
        id={`c_${comment.id}`}
        style={{marginLeft: depth * 30}}
      >
        <hr aria-hidden={true} />
        <div
          className={highlighted === comment.id ? 'highlighted-comment' : ''}
        >
          <AuthorName author={comment.user} />
          {isStaff(comment.tags) ? <TagLabel>Staff</TagLabel> : null}

          {commentIsBest(comment)
            ? <TagLabel><BestIndicator /></TagLabel>
            : null }

          <span className={styles.bylineSecondary}>
            <PubDate created_at={comment.created_at} />
            {
              (comment.editing && comment.editing.edited)
              ? <span>&nbsp;<span className={styles.editedMarker}>(Edited)</span></span>
              : null
            }
          </span>

          <Slot
            fill="commentInfoBar"
            data={this.props.data}
            root={this.props.root}
            comment={comment}
            commentId={comment.id}
            inline
          />

          { (currentUser &&
              (comment.user.id === currentUser.id))

              /* User can edit/delete their own comment for a short window after posting */
              ? <span className={classnames(styles.topRight)}>
                  {
                    commentIsStillEditable(comment) &&
                    <a
                      className={classnames(styles.link, {[styles.active]: this.state.isEditing})}
                      onClick={this.onClickEdit}>Edit</a>
                  }
                </span>

              /* TopRightMenu allows currentUser to ignore other users' comments */
              : <span className={classnames(styles.topRight, styles.topRightMenu)}>
                  <TopRightMenu
                    comment={comment}
                    ignoreUser={ignoreUser}
                    addNotification={addNotification} />
                </span>
          }

          { 
            this.state.isEditing
            ? <EditableCommentContent
                editComment={this.props.editComment.bind(null, comment.id, asset.id)}
                addNotification={addNotification}
                asset={asset}
                comment={comment}
                currentUser={currentUser}
                maxCharCount={maxCharCount}
                parentId={parentId}
                stopEditing={this.stopEditing}
                />
            : <div>
                <Content body={comment.body} />
                <Slot fill="commentContent" />
              </div>
          }

          <div className="commentActionsLeft comment__action-container">
            <Slot
              fill="commentReactions"
              data={this.props.data}
              root={this.props.root}
              comment={comment}
              commentId={comment.id}
              inline
            />
            {!disableReply &&
              <ActionButton>
                <ReplyButton
                  onClick={() => setActiveReplyBox(comment.id)}
                  parentCommentId={parentId || comment.id}
                  currentUserId={currentUser && currentUser.id}
                  banned={false}
                />
              </ActionButton>}
            <ActionButton>
              <IfUserCanModifyBest user={currentUser}>
                <BestButton
                  isBest={commentIsBest(comment)}
                  addBest={addBestTag}
                  removeBest={removeBestTag}
                />
              </IfUserCanModifyBest>
            </ActionButton>
            <Slot
              fill="commentActions"
              data={this.props.data}
              root={this.props.root}
              comment={comment}
              commentId={comment.id}
              inline
            />
          </div>
          <div className="commentActionsRight comment__action-container">
            <ActionButton>
              <PermalinkButton articleURL={asset.url} commentId={comment.id} />
            </ActionButton>
            <ActionButton>
              <FlagComment
                flaggedByCurrentUser={!!myFlag}
                flag={myFlag}
                id={comment.id}
                author_id={comment.user.id}
                postFlag={postFlag}
                postDontAgree={postDontAgree}
                deleteAction={deleteAction}
                showSignInDialog={showSignInDialog}
                currentUser={currentUser}
              />
            </ActionButton>
          </div>
        </div>
        {activeReplyBox === comment.id
          ? <ReplyBox
              commentPostedHandler={() => {
                setActiveReplyBox('');
              }}
              charCountEnable={charCountEnable}
              maxCharCount={maxCharCount}
              setActiveReplyBox={setActiveReplyBox}
              parentId={parentId || comment.id}
              addNotification={addNotification}
              authorId={currentUser.id}
              postItem={postItem}
              assetId={asset.id}
            />
          : null}
        {comment.replies &&
          comment.replies.map(reply => {
            return commentIsIgnored(reply)
              ? <IgnoredCommentTombstone key={reply.id} />
              : <Comment
                  data={this.props.data}
                  root={this.props.root}
                  setActiveReplyBox={setActiveReplyBox}
                  disableReply={disableReply}
                  activeReplyBox={activeReplyBox}
                  addNotification={addNotification}
                  parentId={comment.id}
                  postItem={postItem}
                  editComment={this.props.editComment}
                  depth={depth + 1}
                  asset={asset}
                  highlighted={highlighted}
                  currentUser={currentUser}
                  postFlag={postFlag}
                  deleteAction={deleteAction}
                  addCommentTag={addCommentTag}
                  removeCommentTag={removeCommentTag}
                  ignoreUser={ignoreUser}
                  charCountEnable={charCountEnable}
                  maxCharCount={maxCharCount}
                  showSignInDialog={showSignInDialog}
                  reactKey={reply.id}
                  key={reply.id}
                  comment={reply}
                />;
          })}
        {comment.replies &&
          <div className="coral-load-more-replies">
            <LoadMore
              assetId={asset.id}
              comments={comment.replies}
              parentId={comment.id}
              topLevel={false}
              replyCount={comment.replyCount}
              moreComments={comment.replyCount > comment.replies.length}
              loadMore={loadMore}
            />
          </div>}
      </div>
    );
  }
}

export default Comment;

// return whether the comment is editable
function commentIsStillEditable (comment) {
  const editing = comment && comment.editing;
  if ( ! editing) {return false;}
  const editableUntil = getEditableUntilDate(comment);
  const editWindowExpired = (editableUntil - new Date) < 0;
  return ! editWindowExpired;  
}

// return number of milliseconds before edit window expires
function editWindowRemainingMs (comment) {
  const editableUntil = getEditableUntilDate(comment);
  if ( ! editableUntil) {return;}
  const now = new Date();
  const editWindowRemainingMs = (editableUntil - now);
  return editWindowRemainingMs;
}
