import React, {PropTypes} from 'react';

import {Button} from 'coral-ui';
import LoadMore from './LoadMore';
import NewCount from './NewCount';
import Comment from '../containers/Comment';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import {ModerationLink} from 'coral-plugin-moderation';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import QuestionBox from 'coral-plugin-questionbox/QuestionBox';
import IgnoredCommentTombstone from './IgnoredCommentTombstone';
import SuspendedAccount from './SuspendedAccount';
import RestrictedMessageBox
  from 'coral-framework/components/RestrictedMessageBox';
import {can} from 'coral-framework/services/perms';
import ChangeUsernameContainer
  from 'coral-sign-in/containers/ChangeUsernameContainer';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';

const lang = new I18n(translations);

class Stream extends React.Component {
  setActiveReplyBox = (reactKey) => {
    if (!this.props.auth.user) {
      this.props.showSignInDialog();
    } else {
      this.props.setActiveReplyBox(reactKey);
    }
  };

  render() {
    const {
      root: {asset, asset: {comments}, comment, me},
      postComment,
      addNotification,
      postFlag,
      postDontAgree,
      loadMore,
      deleteAction,
      showSignInDialog,
      addCommentTag,
      removeCommentTag,
      pluginProps,
      ignoreUser,
      auth: {loggedIn, user},
      commentCountCache,
      editName
    } = this.props;
    const open = asset.closedAt === null;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    const highlightedComment = comment && comment.parent
      ? comment.parent
      : comment;

    const banned = user && user.status === 'BANNED';
    const temporarilySuspended = user && user.suspension.until && new Date(user.suspension.until) > new Date();

    const hasOlderComments = !!(asset &&
      asset.lastComment &&
      asset.lastComment.id !== asset.comments[asset.comments.length - 1].id);

    // Find the created_at date of the first comment. If no comments exist, set the date to a week ago.
    const firstCommentDate = asset.comments[0]
      ? asset.comments[0].created_at
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
    const commentIsIgnored = (comment) => {
      return me && me.ignoredUsers && me.ignoredUsers.find((u) => u.id === comment.user.id);
    };
    return (
      <div id="stream">
        {open
          ? <div id="commentBox">
              <InfoBox
                content={asset.settings.infoBoxContent}
                enable={asset.settings.infoBoxEnable}
              />
              <QuestionBox
                content={asset.settings.questionBoxContent}
                enable={asset.settings.questionBoxEnable}
              />
              {!banned && temporarilySuspended &&
                <RestrictedMessageBox>
                  {
                    lang.t('temporarilySuspended',
                      this.props.root.settings.organizationName,
                      lang.timeago(user.suspension.until),
                    )
                  }
                </RestrictedMessageBox>
              }
              {banned &&
                <SuspendedAccount
                  canEditName={user && user.canEditName}
                  editName={editName}
                />
              }
              {loggedIn && !banned && !temporarilySuspended &&
                <CommentBox
                    addNotification={this.props.addNotification}
                    postComment={this.props.postComment}
                    appendItemArray={this.props.appendItemArray}
                    updateItem={this.props.updateItem}
                    setCommentCountCache={this.props.setCommentCountCache}
                    commentCountCache={commentCountCache}
                    assetId={asset.id}
                    premod={asset.settings.moderation}
                    isReply={false}
                    authorId={user.id}
                    charCountEnable={asset.settings.charCountEnable}
                    maxCharCount={asset.settings.charCount}
                  />
              }
            </div>
          : <p>{asset.settings.closedMessage}</p>}
        {!loggedIn &&
          <Button
            id="coralSignInButton"
            onClick={this.props.showSignInDialog}
            full
          >
            Sign in to comment
          </Button>}
        {loggedIn &&
          user &&
          <ChangeUsernameContainer loggedIn={loggedIn} user={user} />}
        {loggedIn && <ModerationLink assetId={asset.id} isAdmin={can(user, 'MODERATE_COMMENTS')} />}

        {/* the highlightedComment is isolated after the user followed a permalink */}
        {highlightedComment
          ? <Comment
              data={this.props.data}
              root={this.props.root}
              setActiveReplyBox={this.setActiveReplyBox}
              activeReplyBox={this.props.activeReplyBox}
              addNotification={addNotification}
              depth={0}
              postComment={this.props.postComment}
              asset={asset}
              currentUser={user}
              highlighted={comment.id}
              postFlag={this.props.postFlag}
              postDontAgree={this.props.postDontAgree}
              loadMore={this.props.loadMore}
              deleteAction={this.props.deleteAction}
              showSignInDialog={this.props.showSignInDialog}
              key={highlightedComment.id}
              commentIsIgnored={commentIsIgnored}
              reactKey={highlightedComment.id}
              comment={highlightedComment}
              charCountEnable={asset.settings.charCountEnable}
              maxCharCount={asset.settings.charCount}
              editComment={this.props.editComment}
            />
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
                {comments.map(
                  (comment) => {
                    return (commentIsIgnored(comment)
                      ? <IgnoredCommentTombstone key={comment.id} />
                      : <Comment
                          data={this.props.data}
                          root={this.props.root}
                          disableReply={!open}
                          setActiveReplyBox={this.setActiveReplyBox}
                          activeReplyBox={this.props.activeReplyBox}
                          addNotification={addNotification}
                          depth={0}
                          postComment={postComment}
                          asset={asset}
                          currentUser={user}
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
                          charCountEnable={asset.settings.charCountEnable}
                          maxCharCount={asset.settings.charCount}
                          editComment={this.props.editComment}
                        />
                    );
                  }
                )}
              </div>
              <LoadMore
                topLevel={true}
                assetId={asset.id}
                comments={asset.comments}
                moreComments={hasOlderComments}
                loadMore={this.props.loadMore}
              />
            </div>}
      </div>
    );
  }
}

Stream.propTypes = {
  addNotification: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,

  // dispatch action to add a tag to a comment
  addCommentTag: PropTypes.func,

  // dispatch action to remove a tag from a comment
  removeCommentTag: PropTypes.func,

  // dispatch action to ignore another user
  ignoreUser: React.PropTypes.func,

  // edit a comment, passed (id, asset_id, { body })
  editComment: React.PropTypes.func,
};

export default Stream;
