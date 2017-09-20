import React from 'react';
import PropTypes from 'prop-types';
import {StreamError} from './StreamError';
import Comment from '../containers/Comment';
import SuspendedAccount from './SuspendedAccount';
import Slot from 'coral-framework/components/Slot';
import InfoBox from 'talk-plugin-infobox/InfoBox';
import {can} from 'coral-framework/services/perms';
import {ModerationLink} from 'talk-plugin-moderation';
import RestrictedMessageBox
  from 'coral-framework/components/RestrictedMessageBox';
import t, {timeago} from 'coral-framework/services/i18n';
import CommentBox from 'talk-plugin-commentbox/CommentBox';
import QuestionBox from 'talk-plugin-questionbox/QuestionBox';
import {isCommentActive} from 'coral-framework/utils';
import {Button, Tab, TabCount, TabPane} from 'coral-ui';
import cn from 'classnames';

import {getTopLevelParent, attachCommentToParent} from '../graphql/utils';
import AllCommentsPane from './AllCommentsPane';
import AutomaticAssetClosure from '../containers/AutomaticAssetClosure';
import StreamTabPanel from '../containers/StreamTabPanel';

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
    if (!this.props.userIsDegraged && next.userIsDegraged) {
      this.setState({keepCommentBox: true});
    }
  }

  renderHighlightedComment() {
    const {
      data,
      root,
      activeReplyBox,
      setActiveReplyBox,
      commentClassNames,
      root: {asset, asset: {comment}},
      postComment,
      notify,
      editComment,
      postFlag,
      postDontAgree,
      deleteAction,
      showSignInDialog,
      loadNewReplies,
      auth: {user},
      emit,
    } = this.props;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    let topLevelComment = getTopLevelParent(comment);
    if (topLevelComment) {

      // Inactive comments can be viewed by moderators and admins (e.g. using permalinks).
      const isInactive = !isCommentActive(comment.status);
      if (comment.parent && isInactive) {

        // the highlighted comment is not active and as such not in the replies, so we
        // attach it to the right parent.
        topLevelComment = attachCommentToParent(topLevelComment, comment);
      }
    }

    return (
      <div className={cn('talk-stream-highlighted-container', styles.highlightedContainer)}>
        <Comment
          data={data}
          root={root}
          commentClassNames={commentClassNames}
          setActiveReplyBox={setActiveReplyBox}
          activeReplyBox={activeReplyBox}
          notify={notify}
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
          key={topLevelComment.id}
          comment={topLevelComment}
          charCountEnable={asset.settings.charCountEnable}
          maxCharCount={asset.settings.charCount}
          editComment={editComment}
          emit={emit}
          liveUpdates={true}
        />
      </div>
    );
  }

  renderTabPanel() {
    const {
      data,
      root,
      activeReplyBox,
      setActiveReplyBox,
      commentClassNames,
      root: {asset, asset: {comments, totalCommentCount}},
      postComment,
      notify,
      editComment,
      postFlag,
      postDontAgree,
      deleteAction,
      showSignInDialog,
      activeStreamTab,
      setActiveStreamTab,
      loadNewReplies,
      loadMoreComments,
      auth: {user},
      emit,
      sortOrder,
      sortBy,
      loading,
    } = this.props;

    const slotProps = {data};
    const slotQueryData = {root, asset};

    // `key` of `StreamTabPanel` depends on sorting so that we always reset
    // the state when changing sorting.
    return (
      <div className={cn('talk-stream-tab-container', styles.tabContainer)}>
        <div
          className={cn('talk-stream-filter-wrapper', styles.filterWrapper)}
        >
          <Slot
            fill="streamFilter"
            queryData={slotQueryData}
            {...slotProps}
          />
        </div>
        <StreamTabPanel
          key={`${sortBy}_${sortOrder}`}
          activeTab={activeStreamTab}
          setActiveTab={setActiveStreamTab}
          fallbackTab={'all'}
          tabSlot={'streamTabs'}
          tabPaneSlot={'streamTabPanes'}
          slotProps={slotProps}
          queryData={slotQueryData}
          loading={loading}
          appendTabs={
            <Tab tabId={'all'} key='all'>
              {t('stream.all_comments')} <TabCount active={activeStreamTab === 'all'} sub>{totalCommentCount}</TabCount>
            </Tab>
          }
          appendTabPanes={
            <TabPane tabId={'all'} key='all'>
              <AllCommentsPane
                data={data}
                root={root}
                comments={comments}
                commentClassNames={commentClassNames}
                setActiveReplyBox={setActiveReplyBox}
                activeReplyBox={activeReplyBox}
                notify={notify}
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
                charCountEnable={asset.settings.charCountEnable}
                maxCharCount={asset.settings.charCount}
                editComment={editComment}
                emit={emit}
              />
            </TabPane>
          }
          sub
        />
      </div>
    );
  }

  render() {
    const {
      data,
      root,
      appendItemArray,
      root: {asset, asset: {comment: highlightedComment}},
      postComment,
      notify,
      updateItem,
      viewAllComments,
      auth: {loggedIn, user},
      editName,
    } = this.props;
    const {keepCommentBox} = this.state;
    const open = !asset.isClosed;

    const banned = user && user.status === 'BANNED';
    const temporarilySuspended =
      user &&
      user.suspension.until &&
      new Date(user.suspension.until) > new Date();

    const showCommentBox = loggedIn && ((!banned && !temporarilySuspended && !highlightedComment) || keepCommentBox);
    const slotProps = {data};
    const slotQueryData = {root, asset};

    if (highlightedComment === null) {
      return <StreamError>{t('stream.comment_not_found')}</StreamError>;
    }

    return (
      <div id="stream" className={styles.root}>
        <AutomaticAssetClosure assetId={asset.id} closedAt={asset.closedAt}/>
        {highlightedComment &&
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
              icon={asset.settings.questionBoxIcon}
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
                  notify={notify}
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
          queryData={slotQueryData}
          {...slotProps}
        />

        {loggedIn && (
          <ModerationLink
            assetId={asset.id}
            isAdmin={can(user, 'MODERATE_COMMENTS')}
          />
        )}

        {highlightedComment
          ? this.renderHighlightedComment()
          : this.renderTabPanel()
        }
      </div>
    );
  }
}

Stream.propTypes = {
  notify: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,

  // edit a comment, passed (id, asset_id, { body })
  editComment: PropTypes.func
};

export default Stream;
