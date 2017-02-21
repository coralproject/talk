import React from 'react';
import styles from 'coral-embed-stream/src/Comment.css';

import PermalinkButton from 'coral-plugin-permalinks/PermalinkButton';
import AuthorName from 'coral-plugin-author-name/AuthorName';
import Content from 'coral-plugin-commentcontent/CommentContent';
import PubDate from 'coral-plugin-pubdate/PubDate';
import {ReplyButton} from 'coral-plugin-replies';
import FlagComment from 'coral-plugin-flags/FlagComment';
import LikeButton from 'coral-plugin-likes/LikeButton';

class FakeComment extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    const {username, created_at, body} = this.props;

    return (
      <div
        className={`comment ${styles.Comment}`}
        style={{marginLeft: 0 * 30}}>
        <hr aria-hidden={true} />
        <AuthorName
          author={{'name': username}}/>
        <PubDate created_at={created_at} />
        <Content body={body} />
          <div className="commentActionsLeft">
              <LikeButton
                like={{}}
                id="commentID"
                postLike={()=>{return;}}
                deleteAction={()=>{return;}}
                showSignInDialog={()=>{return;}}
                currentUser={{}}
              />
              <ReplyButton
                onClick={() => {}}
                parentCommentId={'commentID'}
                currentUserId={{}}
                banned={false}
              />
            </div>
        <div className="commentActionsRight">
          <PermalinkButton articleURL={''} commentId={'commentId'} />
          <FlagComment />
        </div>
      </div>
    );
  }
}

export default FakeComment;
