import React, {PropTypes} from 'react';
import LoadMore from './LoadMore';
import Comment from '../components/Comment';
import SuspendedAccount from './SuspendedAccount';
import Slot from 'coral-framework/components/Slot';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import {can} from 'coral-framework/services/perms';
import {ModerationLink} from 'coral-plugin-moderation';
import RestrictedMessageBox
  from 'coral-framework/components/RestrictedMessageBox';
import t, {timeago} from 'coral-framework/services/i18n';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import QuestionBox from 'coral-plugin-questionbox/QuestionBox';
import IgnoredCommentTombstone from './IgnoredCommentTombstone';
import NewCount from './NewCount';
import {TransitionGroup} from 'react-transition-group';

const hasComment = (nodes, id) => nodes.some((node) => node.id === id);

// resetCursors will return the id cursors of the first and second comment of
// the current comment list. The cursors are used to dertermine which
// comments to show. The spare cursor functions as a backup in case one
// of the comments gets deleted.
function resetCursors(state, props) {
  const comments = props.root.asset.comments;
  if (comments && comments.nodes.length) {
    const idCursors = [comments.nodes[0].id];
    if (comments.nodes[1]) {
      idCursors.push(comments.nodes[1].id);
    }
    return {idCursors};
  }
  return {idCursors: []};
}

// invalidateCursor is called whenever a comment is removed which is referenced
// by one of the 2 id cursors. It returns a new set of id cursors calculated
// using the help of the backup cursor.
function invalidateCursor(invalidated, state, props) {
  const alt = invalidated === 1 ? 0 : 1;
  const comments = props.root.asset.comments;
  const idCursors = [];
  if (state.idCursors[alt]) {
    idCursors.push(state.idCursors[alt]);
    const index = comments.nodes.findIndex((node) => node.id === idCursors[0]);
    const nextInLine = comments.nodes[index + 1];
    if (nextInLine) {
      idCursors.push(nextInLine.id);
    }
  }
  return {idCursors};
}

class Stream extends React.Component {

  constructor(props) {
    super(props);
    this.state = resetCursors(this.state, props);
  }

  componentWillReceiveProps(next) {
    const {root: {asset: {comments: prevComments}}} = this.props;
    const {root: {asset: {comments: nextComments}}} = next;

    if (!prevComments && nextComments) {
      this.setState(resetCursors);
      return;
    }
    if (
        prevComments && nextComments &&
        nextComments.nodes.length < prevComments.nodes.length
    ) {

      // Invalidate first cursor if referenced comment was removed.
      if (this.state.idCursors[0] && !hasComment(nextComments.nodes, this.state.idCursors[0])) {
        this.setState(invalidateCursor(0, this.state, next));
      }

      // Invalidate second cursor if referenced comment was removed.
      if (this.state.idCursors[1] && !hasComment(nextComments.nodes, this.state.idCursors[1])) {
        this.setState(invalidateCursor(1, this.state, next));
      }
    }
  }

  viewNewComments = () => {
    this.setState(resetCursors);
  };

  setActiveReplyBox = (reactKey) => {
    if (!this.props.auth.user) {
      this.props.showSignInDialog();
    } else {
      this.props.setActiveReplyBox(reactKey);
    }
  };

  // getVisibileComments returns a list containing comments
  // which were authored by current user or comes after the `idCursor`.
  getVisibleComments() {
    const {root: {asset: {comments}}, auth: {user}} = this.props;
    const idCursor = this.state.idCursors[0];
    const userId = user ? user.id : null;

    if (!comments) {
      return [];
    }

    const view = [];
    let pastCursor = false;
    comments.nodes.forEach((comment) => {
      if (comment.id === idCursor) {
        pastCursor = true;
      }
      if (pastCursor || comment.user.id === userId) {
        view.push(comment);
      }
    });
    return view;
  }

  render() {
    const {
      commentClassNames,
      root: {asset, asset: {comments}, comment, me},
      postComment,
      addNotification,
      postFlag,
      postDontAgree,
      deleteAction,
      showSignInDialog,
      addCommentTag,
      ignoreUser,
      auth: {loggedIn, user},
      removeCommentTag,
      pluginProps,
      editName
    } = this.props;
    const view = this.getVisibleComments();
    const open = asset.closedAt === null;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    const highlightedComment = comment && comment.parent
      ? comment.parent
      : comment;

    const banned = user && user.status === 'BANNED';
    const temporarilySuspended =
      user &&
      user.suspension.until &&
      new Date(user.suspension.until) > new Date();

    const commentIsIgnored = (comment) => {
      return (
        me &&
        me.ignoredUsers &&
        me.ignoredUsers.find((u) => u.id === comment.user.id)
      );
    };
    return (
      <div id="stream">
        <Slot fill="stream" />
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
              {!banned &&
                temporarilySuspended &&
                <RestrictedMessageBox>
                  {t(
                    'stream.temporarily_suspended',
                    this.props.root.settings.organizationName,
                    timeago(user.suspension.until)
                  )}
                </RestrictedMessageBox>}
              {banned &&
                <SuspendedAccount
                  canEditName={user && user.canEditName}
                  editName={editName}
                />}
              {loggedIn &&
                !banned &&
                !temporarilySuspended &&
                !highlightedComment &&
                <CommentBox
                  addNotification={this.props.addNotification}
                  postComment={this.props.postComment}
                  appendItemArray={this.props.appendItemArray}
                  updateItem={this.props.updateItem}
                  assetId={asset.id}
                  premod={asset.settings.moderation}
                  isReply={false}
                  authorId={user.id}
                  charCountEnable={asset.settings.charCountEnable}
                  maxCharCount={asset.settings.charCount}
                />}
            </div>
          : <p>{asset.settings.closedMessage}</p>}

        {loggedIn && (
          <ModerationLink
            assetId={asset.id}
            isAdmin={can(user, 'MODERATE_COMMENTS')}
          />
        )}

        <div className="streamBox">
          <Slot fill="streamBox" />
        </div>

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
              loadMore={this.props.loadNewReplies}
              deleteAction={this.props.deleteAction}
              showSignInDialog={this.props.showSignInDialog}
              key={highlightedComment.id}
              commentIsIgnored={commentIsIgnored}
              reactKey={highlightedComment.id}
              comment={highlightedComment}
              charCountEnable={asset.settings.charCountEnable}
              maxCharCount={asset.settings.charCount}
              editComment={this.props.editComment}
              liveUpdates={true}
            />
          : <div className="commentStreamContainer">
              <NewCount
                count={comments.nodes.length - view.length}
                loadMore={this.viewNewComments}
              />
              <TransitionGroup component='div' className="embed__stream">
                {view.map((comment) => {
                  return commentIsIgnored(comment)
                    ? <IgnoredCommentTombstone key={comment.id} />
                    : <Comment
                        commentClassNames={commentClassNames}
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
                        loadMore={this.props.loadNewReplies}
                        deleteAction={deleteAction}
                        showSignInDialog={showSignInDialog}
                        key={comment.id}
                        reactKey={comment.id}
                        comment={comment}
                        pluginProps={pluginProps}
                        charCountEnable={asset.settings.charCountEnable}
                        maxCharCount={asset.settings.charCount}
                        editComment={this.props.editComment}
                        liveUpdates={false}
                      />;
                })}
              </TransitionGroup>
              <LoadMore
                topLevel={true}
                moreComments={asset.comments.hasNextPage}
                loadMore={this.props.loadMoreComments}
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
  editComment: React.PropTypes.func
};

export default Stream;
