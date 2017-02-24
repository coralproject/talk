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
import LoadMore from 'coral-embed-stream/src/LoadMore';

import styles from './Comment.css';

const getActionSummary = (type, comment) => comment.action_summaries
  .filter((a) => a.__typename === type)[0];
const isStaff = (tags) => !tags.every((t) => t.name !== 'STAFF') ;

class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {replyBoxVisible: false};
  }

  static propTypes = {
    reactKey: PropTypes.string.isRequired,

    // id of currently opened ReplyBox. tracked in Stream.js
    activeReplyBox: PropTypes.string.isRequired,
    setActiveReplyBox: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    showSignInDialog: PropTypes.func.isRequired,
    postFlag: PropTypes.func.isRequired,
    postLike: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
    parentId: PropTypes.string,
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
    }).isRequired
  }

  render () {
    const {
      comment,
      parentId,
      currentUser,
      asset,
      depth,
      postItem,
      refetch,
      addNotification,
      showSignInDialog,
      postLike,
      postFlag,
      loadMore,
      setActiveReplyBox,
      activeReplyBox,
      deleteAction
    } = this.props;

    const like = getActionSummary('LikeActionSummary', comment);
    const flag = getActionSummary('FlagActionSummary', comment);

    return (
      <div
        className={parentId ? `reply ${styles.Reply}` : `comment ${styles.Comment}`}
        id={`c_${comment.id}`}
        style={{marginLeft: depth * 30}}>
        <hr aria-hidden={true} />
        <AuthorName
          author={comment.user}/>
        { isStaff(comment.tags)
          ? <TagLabel isStaff={true}/>
          : null }
        <PubDate created_at={comment.created_at} />
        <Content body={comment.body} />
          <div className="commentActionsLeft">
              <LikeButton
                like={like}
                id={comment.id}
                postLike={postLike}
                deleteAction={deleteAction}
                showSignInDialog={showSignInDialog}
                currentUser={currentUser} />
              <ReplyButton
                onClick={() => setActiveReplyBox(comment.id)}
                parentCommentId={parentId || comment.id}
                currentUserId={currentUser && currentUser.id}
                banned={false} />
            </div>
        <div className="commentActionsRight">
          <PermalinkButton articleURL={asset.url} commentId={comment.id} />
          <FlagComment
            flag={flag}
            id={comment.id}
            author_id={comment.user.id}
            postFlag={postFlag}
            deleteAction={deleteAction}
            showSignInDialog={showSignInDialog}
            currentUser={currentUser} />
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
              refetch={refetch}
              setActiveReplyBox={setActiveReplyBox}
              activeReplyBox={activeReplyBox}
              addNotification={addNotification}
              parentId={comment.id}
              postItem={postItem}
              depth={depth + 1}
              asset={asset}
              currentUser={currentUser}
              postLike={postLike}
              postFlag={postFlag}
              deleteAction={deleteAction}
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
              moreComments={comment.replyCount > comment.replies.length}
              loadMore={loadMore}/>
          </div>
        }
      </div>
    );
  }
}

export default Comment;
