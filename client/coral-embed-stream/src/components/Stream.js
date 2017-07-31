import React from 'react';
import PropTypes from 'prop-types';
import {StreamError} from './StreamError';
import Comment from '../components/Comment';
import SuspendedAccount from './SuspendedAccount';
import Slot from 'coral-framework/components/Slot';
import InfoBox from 'talk-plugin-infobox/InfoBox';
import {can} from 'coral-framework/services/perms';
import {ModerationLink} from 'talk-plugin-moderation';
import RestrictedMessageBox
  from 'coral-framework/components/RestrictedMessageBox';
import t, {timeago} from 'coral-framework/services/i18n';
import {getSlotComponents} from 'coral-framework/helpers/plugins';
import CommentBox from 'talk-plugin-commentbox/CommentBox';
import QuestionBox from 'talk-plugin-questionbox/QuestionBox';
import {isCommentActive} from 'coral-framework/utils';
import {Button, TabBar, Tab, TabCount, TabContent, TabPane} from 'coral-ui';
import cn from 'classnames';

import {getTopLevelParent, attachCommentToParent} from '../graphql/utils';
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

    this.fallbackAllTab(next);
  }

  componentDidMount() {
    this.fallbackAllTab();
  }

  fallbackAllTab(props = this.props) {
    if (props.activeStreamTab !== 'all') {
      const slotPlugins = this.getSlotComponents('streamTabs', props).map((c) => c.talkPluginName);
      if (slotPlugins.indexOf(props.activeStreamTab) === -1) {
        props.setActiveStreamTab('all');
      }
    }
  }

  getSlotProps({data, root, root: {asset}} = this.props) {
    return {data, root, asset};
  }

  getSlotComponents(slot, props = this.props) {
    return getSlotComponents(slot, props.reduxState, this.getSlotProps(props));
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
      root: {asset, asset: {comment, comments, totalCommentCount}, me},
      postComment,
      addNotification,
      editComment,
      postFlag,
      postDontAgree,
      deleteAction,
      showSignInDialog,
      updateItem,
      ignoreUser,
      activeStreamTab,
      setActiveStreamTab,
      loadNewReplies,
      loadMoreComments,
      viewAllComments,
      auth: {loggedIn, user},
      editName
    } = this.props;
    const {keepCommentBox} = this.state;
    const open = asset.closedAt === null;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    let highlightedComment = comment && getTopLevelParent(comment);
    if (highlightedComment) {
      const isInactive = !isCommentActive(comment.status);
      if (comment.parent && isInactive) {

        // the highlighted comment is not active and as such not in the replies, so we
        // attach it to the right parent.
        highlightedComment = attachCommentToParent(highlightedComment, comment);
      }
    }

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
    const slotProps = this.getSlotProps();

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

        <Slot
          fill="stream"
          {...slotProps}
        />

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
                <Slot
                  fill="streamFilter"
                  {...slotProps}
                />
              </div>
              <TabBar activeTab={activeStreamTab} onTabClick={setActiveStreamTab} sub>
                {this.getSlotComponents('streamTabs').map((PluginComponent) => (
                  <Tab tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
                    <PluginComponent
                      {...slotProps}
                      active={activeStreamTab === PluginComponent.talkPluginName}
                    />
                  </Tab>
                ))}
                <Tab tabId={'all'}>
                  All Comments <TabCount active={activeStreamTab === 'all'} sub>{totalCommentCount}</TabCount>
                </Tab>
              </TabBar>
              <TabContent activeTab={activeStreamTab} sub>
                {this.getSlotComponents('streamTabPanes').map((PluginComponent) => (
                  <TabPane tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
                    <PluginComponent
                      {...slotProps}
                    />
                  </TabPane>
                ))}
                <TabPane tabId={'all'}>
                  <AllCommentsPane
                    data={data}
                    root={root}
                    comments={comments}
                    commentClassNames={commentClassNames}
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

  // dispatch action to ignore another user
  ignoreUser: React.PropTypes.func,

  // edit a comment, passed (id, asset_id, { body })
  editComment: React.PropTypes.func
};

export default Stream;
