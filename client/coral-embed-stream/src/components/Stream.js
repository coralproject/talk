import React, {PropTypes} from 'react';
import {StreamError} from './StreamError';
import Comment from '../components/Comment';
import SuspendedAccount from './SuspendedAccount';
import Slot from 'coral-framework/components/Slot';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import {can} from 'coral-framework/services/perms';
import {ModerationLink} from 'coral-plugin-moderation';
import RestrictedMessageBox
  from 'coral-framework/components/RestrictedMessageBox';
import t, {timeago} from 'coral-framework/services/i18n';
import {getSlotComponents} from 'coral-framework/helpers/plugins';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import QuestionBox from 'coral-plugin-questionbox/QuestionBox';
import {Button, TabBar, Tab, TabCount, TabContent, TabPane} from 'coral-ui';
import cn from 'classnames';

import {getTopLevelParent} from '../graphql/utils';
import AllCommentsPane from './AllCommentsPane';

import styles from './Stream.css';

class Stream extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keepCommentBox: false,
    };
  }

  componentWillReceiveProps(next) {

    // Keep comment box when user was live suspended, banned, ...
    if (!this.userIsDegraged(this.props) && this.userIsDegraged(next)) {
      this.setState({keepCommentBox: true});
    }
  }

  setActiveReplyBox = (id) => {
    if (!this.props.auth.user) {
      this.props.showSignInDialog();
    } else {
      this.props.setActiveReplyBox(id);
    }
  };

  userIsDegraged({auth: {user}} = this.props) {
    return !can(user, 'INTERACT_WITH_COMMUNITY');
  }

  render() {
    const {
      data,
      root,
      activeReplyBox,
      setActiveReplyBox,
      appendItemArray,
      commentClassNames,
      root: {asset, asset: {comments, totalCommentCount}, comment, me},
      postComment,
      addNotification,
      editComment,
      postFlag,
      postDontAgree,
      deleteAction,
      showSignInDialog,
      updateItem,
      addTag,
      ignoreUser,
      activeStreamTab,
      setActiveStreamTab,
      loadNewReplies,
      loadMoreComments,
      viewAllComments,
      auth: {loggedIn, user},
      removeTag,
      reduxState,
      editName
    } = this.props;
    const {keepCommentBox} = this.state;
    const open = asset.closedAt === null;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    const highlightedComment = comment && getTopLevelParent(comment);

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

    const showCommentBox = loggedIn && ((!banned && !temporarilySuspended && !highlightedComment) || keepCommentBox);
    const streamTabProps = {data, root, asset};

    if (!comment && !comments) {
      console.error('Talk: No comments came back from the graph given that query. Please, check the query params.');
      return <StreamError />;
    }

    return (
      <div id="stream" className={styles.root}>
        {comment &&
          <Button
            cStyle="darkGrey"
            className={cn('talk-stream-show-all-comments-button', styles.viewAllButton)}
            onClick={viewAllComments}
          >
            {t('framework.show_all_comments')}
          </Button>}

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
                    root.settings.organizationName,
                    timeago(user.suspension.until)
                  )}
                </RestrictedMessageBox>}
              {banned &&
                <SuspendedAccount
                  canEditName={user && user.canEditName}
                  editName={editName}
                  currentUsername={user.username}
                />}
              {showCommentBox &&
                <CommentBox
                  addNotification={addNotification}
                  postComment={postComment}
                  appendItemArray={appendItemArray}
                  updateItem={updateItem}
                  assetId={asset.id}
                  premod={asset.settings.moderation}
                  isReply={false}
                  currentUser={user}
                  charCountEnable={asset.settings.charCountEnable}
                  maxCharCount={asset.settings.charCount}
                />}
            </div>
          : <p>{asset.settings.closedMessage}</p>}

        <Slot fill="stream" />

        {loggedIn && (
          <ModerationLink
            assetId={asset.id}
            isAdmin={can(user, 'MODERATE_COMMENTS')}
          />
        )}

        {/* the highlightedComment is isolated after the user followed a permalink */}
        {highlightedComment
          ? (
            <div className={cn('talk-stream-highlighted-container', styles.highlightedContainer)}>
              <Comment
                data={data}
                root={root}
                commentClassNames={commentClassNames}
                addTag={addTag}
                removeTag={removeTag}
                ignoreUser={ignoreUser}
                setActiveReplyBox={setActiveReplyBox}
                activeReplyBox={activeReplyBox}
                addNotification={addNotification}
                depth={0}
                disableReply={!open}
                postComment={postComment}
                asset={asset}
                currentUser={user}
                highlighted={comment.id}
                postFlag={postFlag}
                postDontAgree={postDontAgree}
                loadMore={loadNewReplies}
                deleteAction={deleteAction}
                showSignInDialog={showSignInDialog}
                key={highlightedComment.id}
                commentIsIgnored={commentIsIgnored}
                comment={highlightedComment}
                charCountEnable={asset.settings.charCountEnable}
                maxCharCount={asset.settings.charCount}
                editComment={editComment}
                liveUpdates={true}
              />
            </div>
            )
          : <div className={cn('talk-stream-tab-container', styles.tabContainer)}>
              <div
                className={cn('talk-stream-filter-wrapper', styles.filterWrapper)}
              >
                <Slot fill="streamFilter" />
              </div>
              <TabBar activeTab={activeStreamTab} onTabClick={setActiveStreamTab} sub>
                {getSlotComponents('streamTabs', reduxState, streamTabProps).map((PluginComponent) => (
                  <Tab tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
                    <PluginComponent
                      {...streamTabProps}
                      active={activeStreamTab === PluginComponent.talkPluginName}
                    />
                  </Tab>
                ))}
                <Tab tabId={'all'}>
                  All Comments <TabCount active={activeStreamTab === 'all'} sub>{totalCommentCount}</TabCount>
                </Tab>
              </TabBar>
              <TabContent activeTab={activeStreamTab} sub>
                {getSlotComponents('streamTabPanes', reduxState, streamTabProps).map((PluginComponent) => (
                  <TabPane tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
                    <PluginComponent
                      {...streamTabProps}
                    />
                  </TabPane>
                ))}
                <TabPane tabId={'all'}>
                  <AllCommentsPane
                    data={data}
                    root={root}
                    comments={comments}
                    commentClassNames={commentClassNames}
                    addTag={addTag}
                    removeTag={removeTag}
                    ignoreUser={ignoreUser}
                    setActiveReplyBox={setActiveReplyBox}
                    activeReplyBox={activeReplyBox}
                    addNotification={addNotification}
                    disableReply={!open}
                    postComment={postComment}
                    asset={asset}
                    currentUser={user}
                    postFlag={postFlag}
                    postDontAgree={postDontAgree}
                    loadMore={loadMoreComments}
                    loadNewReplies={loadNewReplies}
                    deleteAction={deleteAction}
                    showSignInDialog={showSignInDialog}
                    commentIsIgnored={commentIsIgnored}
                    charCountEnable={asset.settings.charCountEnable}
                    maxCharCount={asset.settings.charCount}
                    editComment={editComment}
                  />
                </TabPane>
              </TabContent>
            </div>
          }
      </div>
    );
  }
}

Stream.propTypes = {
  addNotification: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,

  // dispatch action to add a tag to a comment
  addTag: PropTypes.func,

  // dispatch action to remove a tag from a comment
  removeTag: PropTypes.func,

  // dispatch action to ignore another user
  ignoreUser: React.PropTypes.func,

  // edit a comment, passed (id, asset_id, { body })
  editComment: React.PropTypes.func
};

export default Stream;
