// this component will
// render its children
// render a like button
// render a permalink button
// render a reply button
// render a flag button
// translate things?

import React, {PropTypes} from 'react';
import PermalinkButton from 'coral-plugin-permalinks/PermalinkButton';
import AuthorName from '../../coral-plugin-author-name/AuthorName';
import Content from '../../coral-plugin-commentcontent/CommentContent';
import PubDate from '../../coral-plugin-pubdate/PubDate';
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies';
import FlagComment from '../../coral-plugin-flags/FlagComment';
import LikeButton from '../../coral-plugin-likes/LikeButton';

const Comment = ({comment, currentUser, asset, depth}) => {
  return (
    <div
      className="comment"
      id={`c_${comment.id}`}
      style={{marginLeft: depth * 30}}>
      <hr aria-hidden={true} />
      {/*<AuthorName
        author={comment.user}
        addNotification={this.props.addNotification}
        id={comment.id}
        author_id={comment.user.id}
        postAction={this.props.postAction}
        showSignInDialog={this.props.showSignInDialog}
        deleteAction={this.props.deleteAction}
        addItem={this.props.addItem}
        updateItem={this.props.updateItem}
        currentUser={currentUser}/>*/}
      <PubDate created_at={comment.created_at} />
      <Content body={comment.body} />
      <div className="commentActionsLeft">

      </div>
      <div className="commentActionsRight">

        <PermalinkButton articleURL={asset.url} commentId={comment.id} />
      </div>
      {
        comment.replies &&
        comment.replies.map(reply => {
          return <Comment
            depth={depth + 1}
            asset={asset}
            currentUser={currentUser}
            key={reply.id}
            comment={reply} />;
        })
      }

    </div>
  );
};

Comment.propTypes = {
  depth: PropTypes.number.isRequired,
  asset: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string
  }).isRequired,
  currentUser: PropTypes.object,
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
};

export default Comment;
