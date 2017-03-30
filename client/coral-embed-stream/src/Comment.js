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
import LoadMore from 'coral-embed-stream/src/LoadMore';
import {Slot} from 'coral-framework';

import styles from './Comment.css';

const getActionSummary = (type, comment) => comment.action_summaries
  .filter((a) => a.__typename === type)[0];
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

    // dispatch action to add a tag to a comment
    addCommentTag: React.PropTypes.func,

    // dispatch action to remove a tag from a comment
    removeCommentTag: React.PropTypes.func,
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
      disableReply,
    } = this.props;

    const like = getActionSummary('LikeActionSummary', comment);
    const flag = getActionSummary('FlagActionSummary', comment);
    const dontagree = getActionSummary('DontAgreeActionSummary', comment);
    let commentClass = parentId ? `reply ${styles.Reply}` : `comment ${styles.Comment}`;
    commentClass += highlighted === comment.id ? ' highlighted-comment' : '';
    commentClass += comment.id === 'pending' ? ` ${styles.pendingComment}` : '';

    // call a function, and if it errors, call addNotification('error', ...) (e.g. to show user a snackbar)
    const notifyOnError = (fn, errorToMessage) => async () => {
      if (typeof errorToMessage !== 'function') {errorToMessage = (error) => error.message;}
      try {
        return await fn();
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

        <div id="Comment.InfoBar">
          <AuthorName
            author={comment.user}/>
          { isStaff(comment.tags)
            ? <TagLabel>Staff</TagLabel>
            : null }

          { commentIsBest(comment)
            ? <TagLabel><BestIndicator /></TagLabel>
            : null }
          <PubDate created_at={comment.created_at} />
          <Slot fill="Comment.InfoBar"  {...this.props}/>
        </div>

        <Content body={comment.body} />
          <div className="commentActionsLeft comment__action-container">
            <ActionButton>
              <LikeButton
                like={like}
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
            <Slot fill="Comment.Detail"  {...this.props}/>
          </div>
        <div className="commentActionsRight comment__action-container">
          <ActionButton>
            <PermalinkButton articleURL={asset.url} commentId={comment.id} />
          </ActionButton>
          <ActionButton>
            <FlagComment
              flag={flag && flag.current_user ? flag : dontagree}
              id={comment.id}
              author_id={comment.user.id}
              postFlag={postFlag}
              postDontAgree={postDontAgree}
              deleteAction={deleteAction}
              showSignInDialog={showSignInDialog}
              currentUser={currentUser} />
          </ActionButton>
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
            return <Comment
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
