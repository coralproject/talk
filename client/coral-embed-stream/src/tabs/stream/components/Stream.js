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

import styles from './Stream.css';
import ChangedUsername from './ChangedUsername';

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
      data,
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
      data,
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

    const slotProps = { data };
    const slotQueryData = { root, asset };

    // `key` of `ExtendableTabPanel` depends on sorting so that we always reset
    // the state when changing sorting.
    return (
      <div className={cn('talk-stream-tab-container', styles.tabContainer)}>
        <div className={cn('talk-stream-filter-wrapper', styles.filterWrapper)}>
          <Slot fill="streamFilter" queryData={slotQueryData} {...slotProps} />
        </div>

        <ExtendableTabPanel
          key={`${sortBy}_${sortOrder}`}
          activeTab={activeStreamTab}
          setActiveTab={setActiveStreamTab}
          fallbackTab="all"
          tabSlot="streamTabs"
          tabSlotPrepend="streamTabsPrepend"
          tabPaneSlot="streamTabPanes"
          slotProps={slotProps}
          queryData={slotQueryData}
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
                data={data}
                root={root}
                asset={asset}
                comments={comments}
                commentClassNames={commentClassNames}
                setActiveReplyBox={setActiveReplyBox}
                activeReplyBox={activeReplyBox}
                notify={notify}
                disableReply={asset.isClosed}
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

  render() {
    const {
      data,
      root,
      appendItemArray,
      asset,
      asset: { comment: highlightedComment, settings: { questionBoxEnable } },
      postComment,
      notify,
      updateItem,
      currentUser,
    } = this.props;
    const { keepCommentBox } = this.state;
    const open = !asset.isClosed;

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
    const slotProps = { data };
    const slotQueryData = { root, asset };

    if (highlightedComment === null) {
      return <StreamError>{t('stream.comment_not_found')}</StreamError>;
    }

    return (
      <div id="stream" className={styles.root}>
        {open ? (
          <div id="commentBox">
            <InfoBox
              content={asset.settings.infoBoxContent}
              enable={asset.settings.infoBoxEnable}
            />
            {questionBoxEnable && (
              <QuestionBox
                content={asset.settings.questionBoxContent}
                icon={asset.settings.questionBoxIcon}
              >
                <Slot
                  fill="streamQuestionArea"
                  queryData={slotQueryData}
                  {...slotProps}
                />
              </QuestionBox>
            )}
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
          <p>{asset.settings.closedMessage}</p>
        )}

        <Slot fill="stream" queryData={slotQueryData} {...slotProps} />

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
  data: PropTypes.object,
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
