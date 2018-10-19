import React from 'react';
import PropTypes from 'prop-types';
import StreamError from './StreamError';
import Comment from '../containers/Comment';
import BannedAccount from '../../../components/BannedAccount';
import ChangeUsername from '../containers/ChangeUsername';
import Slot from 'coral-framework/components/Slot';
import InfoBox from './InfoBox';
import { can } from 'coral-framework/services/perms';
import ModerationLink from './ModerationLink';
import Markdown from 'coral-framework/components/Markdown';
import RestrictedMessageBox from 'coral-framework/components/RestrictedMessageBox';
import t, { timeago } from 'coral-framework/services/i18n';
import CommentBox from '../containers/CommentBox';
import QuestionBox from '../../../components/QuestionBox';
import { Tab, TabCount, TabPane } from 'coral-ui';
import cn from 'classnames';
import get from 'lodash/get';
import { reverseCommentParentTree } from '../../../graphql/utils';
import AllCommentsPane from './AllCommentsPane';
import ExtendableTabPanel from '../../../containers/ExtendableTabPanel';
import ChangedUsername from './ChangedUsername';
import CommentNotFound from '../containers/CommentNotFound';

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
      this.setState({ keepCommentBox: true });
    }
  }

  renderHighlightedComment() {
    const {
      root,
      activeReplyBox,
      setActiveReplyBox,
      commentClassNames,
      asset,
      asset: { comment },
      postComment,
      notify,
      editComment,
      postFlag,
      postDontAgree,
      deleteAction,
      showSignInDialog,
      loadNewReplies,
      currentUser,
      emit,
      viewAllComments,
    } = this.props;

    let topLevelComment = null;
    if (comment) {
      // Reverse the comment tree that we get from bottom-top (comment -> parent) to top-bottom (parent -> comment)
      topLevelComment = reverseCommentParentTree(comment);
    }

    return (
      <div
        className={cn(
          'talk-stream-highlighted-container',
          styles.highlightedContainer
        )}
      >
        <div
          className={cn(
            'talk-stream-show-all-comments-button-container',
            styles.viewAllButtonContainer
          )}
        >
          <button
            className={cn(
              'talk-stream-show-all-comments-button',
              styles.viewAllButton
            )}
            onClick={viewAllComments}
          >
            {t('framework.show_all_comments')}
          </button>
        </div>

        <Comment
          root={root}
          commentClassNames={commentClassNames}
          setActiveReplyBox={setActiveReplyBox}
          activeReplyBox={activeReplyBox}
          notify={notify}
          depth={0}
          disableReply={!open}
          postComment={postComment}
          asset={asset}
          currentUser={currentUser}
          highlighted={comment}
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

  renderExtendableTabPanel() {
    const {
      root,
      activeReplyBox,
      setActiveReplyBox,
      commentClassNames,
      asset,
      asset: { comments, totalCommentCount },
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
      currentUser,
      emit,
      sortOrder,
      sortBy,
      loading,
    } = this.props;

    const slotPassthrough = { root, asset };

    // `key` of `ExtendableTabPanel` depends on sorting so that we always reset
    // the state when changing sorting.
    return (
      <div className={cn('talk-stream-tab-container', styles.tabContainer)}>
        <div className={cn('talk-stream-filter-wrapper', styles.filterWrapper)}>
          <Slot fill="streamFilter" passthrough={slotPassthrough} />
        </div>

        <ExtendableTabPanel
          key={`${sortBy}_${sortOrder}`}
          activeTab={activeStreamTab}
          setActiveTab={setActiveStreamTab}
          fallbackTab="all"
          tabSlot="streamTabs"
          tabSlotPrepend="streamTabsPrepend"
          tabPaneSlot="streamTabPanes"
          slotPassthrough={slotPassthrough}
          loading={loading}
          tabs={
            <Tab tabId={'all'} key="all">
              {t('stream.all_comments')}{' '}
              <TabCount active={activeStreamTab === 'all'} sub>
                {totalCommentCount}
              </TabCount>
            </Tab>
          }
          tabPanes={
            <TabPane tabId="all" key="all">
              <AllCommentsPane
                root={root}
                asset={asset}
                comments={comments}
                commentClassNames={commentClassNames}
                setActiveReplyBox={setActiveReplyBox}
                activeReplyBox={activeReplyBox}
                notify={notify}
                disableReply={
                  asset.isClosed || asset.settings.disableCommenting
                }
                postComment={postComment}
                currentUser={currentUser}
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

  renderQuestionBox() {
    const {
      root,
      asset,
      asset: {
        settings: { questionBoxEnable, questionBoxContent, questionBoxIcon },
      },
    } = this.props;
    const slotPassthrough = { root, asset };
    if (questionBoxEnable) {
      return (
        <QuestionBox content={questionBoxContent} icon={questionBoxIcon}>
          <Slot fill="streamQuestionArea" passthrough={slotPassthrough} />
        </QuestionBox>
      );
    }
  }

  render() {
    const {
      root,
      appendItemArray,
      asset,
      asset: { comment: highlightedComment },
      postComment,
      notify,
      updateItem,
      currentUser,
    } = this.props;
    const { keepCommentBox } = this.state;
    const open = !(asset.isClosed || asset.settings.disableCommenting);

    const banned = get(currentUser, 'status.banned.status');
    const suspensionUntil = get(currentUser, 'status.suspension.until');
    const rejectedUsername =
      get(currentUser, 'status.username.status') === 'REJECTED';
    const changedUsername =
      get(currentUser, 'status.username.status') === 'CHANGED';

    const temporarilySuspended =
      currentUser && suspensionUntil && new Date(suspensionUntil) > new Date();

    const showCommentBox =
      currentUser &&
      ((!banned &&
        !temporarilySuspended &&
        !rejectedUsername &&
        !changedUsername &&
        !highlightedComment) ||
        keepCommentBox);

    if (highlightedComment === null) {
      return (
        <StreamError>
          <CommentNotFound />
        </StreamError>
      );
    }

    const slotPassthrough = { root, asset };

    return (
      <div id="stream" className={styles.root}>
        {open ? (
          <div id="commentBox">
            <InfoBox
              content={asset.settings.infoBoxContent}
              enable={asset.settings.infoBoxEnable}
            />
            {this.renderQuestionBox()}
            {!banned &&
              temporarilySuspended && (
                <RestrictedMessageBox>
                  {t(
                    'stream.temporarily_suspended',
                    root.settings.organizationName,
                    timeago(suspensionUntil)
                  )}
                </RestrictedMessageBox>
              )}
            {changedUsername && <ChangedUsername />}
            {!banned &&
              rejectedUsername && <ChangeUsername user={currentUser} />}
            {banned && <BannedAccount />}
            {showCommentBox && (
              <CommentBox
                root={root}
                notify={notify}
                postComment={postComment}
                appendItemArray={appendItemArray}
                updateItem={updateItem}
                assetId={asset.id}
                premod={asset.settings.moderation}
                isReply={false}
                currentUser={currentUser}
                charCountEnable={asset.settings.charCountEnable}
                maxCharCount={asset.settings.charCount}
              />
            )}
          </div>
        ) : (
          <div>
            {asset.isClosed ? (
              <Markdown content={asset.settings.closedMessage} />
            ) : (
              <Markdown content={asset.settings.disableCommentingMessage} />
            )}
            {this.renderQuestionBox()}
          </div>
        )}

        <Slot fill="stream" passthrough={slotPassthrough} />

        {currentUser && (
          <ModerationLink
            assetId={asset.id}
            isAdmin={can(currentUser, 'MODERATE_COMMENTS')}
          />
        )}

        {highlightedComment
          ? this.renderHighlightedComment()
          : this.renderExtendableTabPanel()}
      </div>
    );
  }
}

Stream.propTypes = {
  asset: PropTypes.object,
  activeStreamTab: PropTypes.string,
  root: PropTypes.object,
  activeReplyBox: PropTypes.string,
  setActiveReplyBox: PropTypes.func,
  commentClassNames: PropTypes.array,
  setActiveStreamTab: PropTypes.func,
  loadMoreComments: PropTypes.func,
  postFlag: PropTypes.func,
  postDontAgree: PropTypes.func,
  deleteAction: PropTypes.func,
  showSignInDialog: PropTypes.func,
  loadNewReplies: PropTypes.func,
  currentUser: PropTypes.object,
  emit: PropTypes.func,
  sortOrder: PropTypes.string,
  sortBy: PropTypes.string,
  loading: PropTypes.bool,
  appendItemArray: PropTypes.func,
  updateItem: PropTypes.func,
  viewAllComments: PropTypes.func,
  notify: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  editComment: PropTypes.func,
  userIsDegraged: PropTypes.bool,
};

export default Stream;
