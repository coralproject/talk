// this component will
// render its children
// render a like button
// render a permalink button
// render a reply button
// render a flag button
// translate things?

import React, {PropTypes} from 'react';
import PermalinkButton from 'coral-plugin-permalinks/PermalinkButton';

import AuthorName from 'coral-plugin-author-name/AuthorName';

import TagLabel from 'coral-plugin-tag-label/TagLabel';
import Content from 'coral-plugin-commentcontent/CommentContent';
import PubDate from 'coral-plugin-pubdate/PubDate';
import {ReplyBox, ReplyButton} from 'coral-plugin-replies';
import FlagComment from 'coral-plugin-flags/FlagComment';
import LikeButton from 'coral-plugin-likes/LikeButton';
import {BestButton, IfUserCanModifyBest, BEST_TAG, commentIsBest, BestIndicator} from 'coral-plugin-best/BestButton';
import Slot from 'coral-framework/components/Slot';
import LoadMore from './LoadMore';
import IgnoredCommentTombstone from './IgnoredCommentTombstone';
import {TopRightMenu} from './TopRightMenu';
import {getActionSummary, getTotalActionCount, iPerformedThisAction} from 'coral-framework/utils';

import styles from './Comment.css';

const isStaff = (tags) => !tags.every((t) => t.name !== 'STAFF') ;

// hold actions links (e.g. Like, Reply) along the comment footer
const ActionButton = ({children}) => {
  return <span className="comment__action-button comment__action-button--nowrap">{ children }</span>;
};

class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {replyBoxVisible: false};
  }

  static propTypes = {
    reactKey: PropTypes.string.isRequired,

    // id of currently opened ReplyBox. tracked in Stream.js
    activeReplyBox: PropTypes.string.isRequired,
    disableReply: PropTypes.bool,
    setActiveReplyBox: PropTypes.func.isRequired,
    showSignInDialog: PropTypes.func.isRequired,
    postFlag: PropTypes.func.isRequired,
    postLike: PropTypes.func.isRequired,
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
        })),
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    // given a comment, return whether it should be rendered as ignored
    commentIsIgnored: React.PropTypes.func,

    // dispatch action to add a tag to a comment
    addCommentTag: React.PropTypes.func,

    // dispatch action to remove a tag from a comment
    removeCommentTag: React.PropTypes.func,

    // dispatch action to ignore another user
    ignoreUser: React.PropTypes.func,
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
      postLike,
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
    } = this.props;

    const likeSummary = getActionSummary('LikeActionSummary', comment);
    const flagSummary = getActionSummary('FlagActionSummary', comment);
    const dontAgreeSummary = getActionSummary('DontAgreeActionSummary', comment);
    let myFlag = null;
    if (iPerformedThisAction('FlagActionSummary', comment)) {
      myFlag = flagSummary.find(s => s.current_user);
    } else if (iPerformedThisAction('DontAgreeActionSummary', comment)) {
      myFlag = dontAgreeSummary.find(s => s.current_user);
    }

    let commentClass = parentId ? `reply ${styles.Reply}` : `comment ${styles.Comment}`;
    commentClass += comment.id === 'pending' ? ` ${styles.pendingComment}` : '';

    // call a function, and if it errors, call addNotification('error', ...) (e.g. to show user a snackbar)
    const notifyOnError = (fn, errorToMessage) => async function (...args) {
      if (typeof errorToMessage !== 'function') {errorToMessage = (error) => error.message;}
      try {
        return await fn(...args);
      } catch (error) {
        addNotification('error', errorToMessage(error));
        throw error;
      }
    };

    const addBestTag = notifyOnError(() => addCommentTag({
      id: comment.id,
      tag: BEST_TAG,
    }), () => 'Failed to tag comment as best');

    const removeBestTag = notifyOnError(() => removeCommentTag({
      id: comment.id,
      tag: BEST_TAG,
    }), () => 'Failed to remove best comment tag');

    return (
      <div
        className={commentClass}
        id={`c_${comment.id}`}
        style={{marginLeft: depth * 30}}>
        <hr aria-hidden={true} />
        <div className={highlighted === comment.id ? 'highlighted-comment' : ''}>
          <AuthorName
            author={comment.user}/>
          { isStaff(comment.tags)
            ? <TagLabel>Staff</TagLabel>
          : null }

          { commentIsBest(comment)
            ? <TagLabel><BestIndicator /></TagLabel>
          : null }
          <PubDate created_at={comment.created_at} />
          <Slot
            fill="commentInfoBar"
            data={this.props.data}
            root={this.props.root}
            comment={comment}
            commentId={comment.id}
            inline
          />
          { (currentUser && (comment.user.id !== currentUser.id))
            ? <span className={styles.topRightMenu}>
                <TopRightMenu
                  comment={comment}
                  ignoreUser={ignoreUser}
                  addNotification={addNotification} />
              </span>
            : null
          }

          <Content body={comment.body} />
          <div className="commentActionsLeft comment__action-container">
            <ActionButton>
              {/* TODO implmement iPerformedThisAction for the like */}
              <LikeButton
                totalLikes={getTotalActionCount('LikeActionSummary', comment)}
                like={likeSummary[0]}
                id={comment.id}
                postLike={postLike}
                deleteAction={deleteAction}
                showSignInDialog={showSignInDialog}
                currentUser={currentUser} />
            </ActionButton>
            {
              !disableReply &&
              <ActionButton>
                <ReplyButton
                  onClick={() => setActiveReplyBox(comment.id)}
                  parentCommentId={parentId || comment.id}
                  currentUserId={currentUser && currentUser.id}
                  banned={false} />
              </ActionButton>
            }
            <ActionButton>
              <IfUserCanModifyBest user={currentUser}>
                <BestButton
                  isBest={commentIsBest(comment)}
                  addBest={addBestTag}
                  removeBest={removeBestTag} />
              </IfUserCanModifyBest>
            </ActionButton>
            <Slot
              fill="commentDetail"
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
                currentUser={currentUser} />
            </ActionButton>
          </div>
        </div>
        {
          activeReplyBox === comment.id
          ? <ReplyBox
              commentPostedHandler={() => {
                setActiveReplyBox('');
              }}
              setActiveReplyBox={setActiveReplyBox}
              parentId={parentId || comment.id}
              addNotification={addNotification}
              authorId={currentUser.id}
              postItem={postItem}
              assetId={asset.id} />
          : null
        }
        {
          comment.replies &&
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
                  depth={depth + 1}
                  asset={asset}
                  highlighted={highlighted}
                  currentUser={currentUser}
                  postLike={postLike}
                  postFlag={postFlag}
                  deleteAction={deleteAction}
                  addCommentTag={addCommentTag}
                  removeCommentTag={removeCommentTag}
                  ignoreUser={ignoreUser}
                  showSignInDialog={showSignInDialog}
                  reactKey={reply.id}
                  key={reply.id}
                  comment={reply} />;
          })
        }
        {
          comment.replies &&
          <div className='coral-load-more-replies'>
            <LoadMore
              assetId={asset.id}
              comments={comment.replies}
              parentId={comment.id}
              topLevel={false}
              replyCount={comment.replyCount}
              moreComments={comment.replyCount > comment.replies.length}
              loadMore={loadMore}/>
          </div>
        }
      </div>
    );
  }
}

export default Comment;
