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
import Content from 'coral-plugin-commentcontent/CommentContent';
import PubDate from 'coral-plugin-pubdate/PubDate';
import {ReplyBox, ReplyButton} from 'coral-plugin-replies';
import FlagComment from 'coral-plugin-flags/FlagComment';
import LikeButton from 'coral-plugin-likes/LikeButton';

const getAction = (type, comment) => comment.actions.filter((a) => a.type === type)[0];

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
    postAction: PropTypes.func.isRequired,
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
      actions: PropTypes.array.isRequired,
      body: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired
        })
      ),
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
      postAction,
      setActiveReplyBox,
      activeReplyBox,
      deleteAction
    } = this.props;

    const like = getAction('LIKE', comment);
    const flag = getAction('FLAG', comment);

    return (
      <div
        className="comment"
        id={`c_${comment.id}`}
        style={{marginLeft: depth * 30}}>
        <hr aria-hidden={true} />
        <AuthorName
          author={comment.user}
          addNotification={this.props.addNotification}
          id={comment.id}
          author_id={comment.user.id}
          postAction={this.props.postAction}
          showSignInDialog={this.props.showSignInDialog}
          deleteAction={this.props.deleteAction}
          currentUser={currentUser}/>
        <PubDate created_at={comment.created_at} />
        <Content body={comment.body} />
          <div className="commentActionsLeft">
              <ReplyButton
                onClick={() => setActiveReplyBox(comment.id)}
                parentCommentId={parentId || comment.id}
                currentUserId={currentUser && currentUser.id}
                banned={false} />
              <LikeButton
                like={like}
                id={comment.id}
                postAction={postAction}
                deleteAction={deleteAction}
                showSignInDialog={showSignInDialog}
                currentUser={currentUser} />
            </div>
        <div className="commentActionsRight">
          <FlagComment
            flag={flag}
            id={comment.id}
            author_id={comment.user.id}
            postAction={postAction}
            deleteAction={deleteAction}
            showSignInDialog={showSignInDialog}
            currentUser={currentUser} />
          <PermalinkButton articleURL={asset.url} commentId={comment.id} />
        </div>
        {
          activeReplyBox === comment.id
          ? <ReplyBox
              commentPostedHandler={() => {
                setActiveReplyBox('');
                refetch();
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
              postAction={postAction}
              deleteAction={deleteAction}
              showSignInDialog={showSignInDialog}
              reactKey={reply.id}
              key={reply.id}
              comment={reply} />;
          })
        }

      </div>
    );
  }
}

export default Comment;
