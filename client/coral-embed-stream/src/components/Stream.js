import React, {PropTypes} from 'react';
import Comment from './Comment';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import SignInContainer from 'coral-sign-in/containers/SignInContainer';
import SuspendedAccount from 'coral-framework/components/SuspendedAccount';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ChangeUsernameContainer from 'coral-sign-in/containers/ChangeUsernameContainer';
import IgnoredCommentTombstone from './IgnoredCommentTombstone';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import QuestionBox from 'coral-plugin-questionbox/QuestionBox';
import LoadMore from './LoadMore';
import NewCount from './NewCount';
import {ModerationLink} from 'coral-plugin-moderation';

class Stream extends React.Component {

  setActiveReplyBox = (reactKey) => {
    if (!this.props.auth.user) {
      const offset = document.getElementById(`c_${reactKey}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
    } else {
      this.props.setActiveReplyBox(reactKey);
    }
  }

  render () {
    const {
      comments,
      asset,
      postItem,
      addNotification,
      postFlag,
      postLike,
      postDontAgree,
      loadMore,
      deleteAction,
      showSignInDialog,
      addCommentTag,
      removeCommentTag,
      pluginProps,
      ignoreUser,
      ignoredUsers,
      auth: {signInOffset, loggedIn, isAdmin, user},
      comment,
      refetch,
      commentCountCache,
      editName,
    } = this.props;
    const open = asset.closedAt === null;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    const highlightedComment = comment && comment.parent ? comment.parent : comment;

    const banned = user && user.status === 'BANNED';

    const hasOlderComments = !!(
      asset &&
      asset.lastComment &&
      asset.lastComment.id !== asset.comments[asset.comments.length - 1].id
    );

    // Find the created_at date of the first comment. If no comments exist, set the date to a week ago.
    const firstCommentDate = asset.comments[0]
      ? asset.comments[0].created_at
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
    const commentIsIgnored = (comment) => ignoredUsers && ignoredUsers.includes(comment.user.id);
    return (
      <div id='stream'>
        {
          open
           ? <div id="commentBox">
               <InfoBox
                 content={asset.settings.infoBoxContent}
                 enable={asset.settings.infoBoxEnable}
               />
               <QuestionBox
                 content={asset.settings.questionBoxContent}
                 enable={asset.settings.questionBoxEnable}
               />
             <RestrictedContent restricted={banned} restrictedComp={
                 <SuspendedAccount
                   canEditName={user && user.canEditName}
                   editName={editName}
                   />
               }>
               {
                 user
                 ? <CommentBox
                    addNotification={this.props.addNotification}
                    postItem={this.props.postItem}
                    appendItemArray={this.props.appendItemArray}
                    updateItem={this.props.updateItem}
                    setCommentCountCache={this.props.setCommentCountCache}
                    commentCountCache={commentCountCache}
                    assetId={asset.id}
                    premod={asset.settings.moderation}
                    isReply={false}
                    currentUser={this.props.auth.user}
                    authorId={user.id}
                    charCount={asset.settings.charCountEnable && asset.settings.charCount} />
                 : null
               }
             </RestrictedContent>
             </div>
           : <p>{asset.settings.closedMessage}</p>
        }
        {!loggedIn && <SignInContainer
          requireEmailConfirmation={asset.settings.requireEmailConfirmation}
          refetch={refetch}
          offset={signInOffset}/>}
        {loggedIn &&  user && <ChangeUsernameContainer loggedIn={loggedIn} offset={signInOffset} user={user} />}
        {loggedIn && <ModerationLink assetId={asset.id} isAdmin={isAdmin} />}

        {/* the highlightedComment is isolated after the user followed a permalink */}
        {
          highlightedComment
          ? <Comment
            refetch={refetch}
            setActiveReplyBox={this.setActiveReplyBox}
            activeReplyBox={this.props.activeReplyBox}
            addNotification={addNotification}
            depth={0}
            postItem={this.props.postItem}
            asset={asset}
            currentUser={user}
            highlighted={comment.id}
            postLike={this.props.postLike}
            postFlag={this.props.postFlag}
            postDontAgree={this.props.postDontAgree}
            loadMore={this.props.loadMore}
            deleteAction={this.props.deleteAction}
            showSignInDialog={this.props.showSignInDialog}
            key={highlightedComment.id}
            commentIsIgnored={commentIsIgnored}
            reactKey={highlightedComment.id}
            comment={highlightedComment} />
          : <div>
            <NewCount
              commentCount={asset.commentCount}
              commentCountCache={commentCountCache}
              loadMore={this.props.loadMore}
              firstCommentDate={firstCommentDate}
              assetId={asset.id}
              setCommentCountCache={this.props.setCommentCountCache}
              />
            <div className="embed__stream">
              {
                comments.map(comment =>
                  commentIsIgnored(comment)
                    ? <IgnoredCommentTombstone
                        key={comment.id}
                      />
                    : <Comment
                        disableReply={!open}
                        setActiveReplyBox={this.setActiveReplyBox}
                        activeReplyBox={this.props.activeReplyBox}
                        addNotification={addNotification}
                        depth={0}
                        postItem={postItem}
                        asset={asset}
                        currentUser={user}
                        postLike={postLike}
                        postFlag={postFlag}
                        postDontAgree={postDontAgree}
                        addCommentTag={addCommentTag}
                        removeCommentTag={removeCommentTag}
                        ignoreUser={ignoreUser}
                        commentIsIgnored={commentIsIgnored}
                        loadMore={loadMore}
                        deleteAction={deleteAction}
                        showSignInDialog={showSignInDialog}
                        key={comment.id}
                        reactKey={comment.id}
                        comment={comment}
                        pluginProps={pluginProps}
                      />
                )
              }
            </div>
            <LoadMore
              topLevel={true}
              assetId={asset.id}
              comments={asset.comments}
              moreComments={hasOlderComments}
              loadMore={this.props.loadMore} />
          </div>
        }
      </div>
    );
  }
}

Stream.propTypes = {
  addNotification: PropTypes.func.isRequired,
  postItem: PropTypes.func.isRequired,
  asset: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,

  // dispatch action to add a tag to a comment
  addCommentTag: PropTypes.func,

  // dispatch action to remove a tag from a comment
  removeCommentTag: PropTypes.func,

  // dispatch action to ignore another user
  ignoreUser: React.PropTypes.func,

  // list of user ids that should be rendered as ignored
  ignoredUsers: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default Stream;
