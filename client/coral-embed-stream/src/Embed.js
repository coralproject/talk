import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

import {TabBar, Tab, TabContent, Spinner, Button} from 'coral-ui';

const {logout, showSignInDialog, requestConfirmEmail, openSignInPopUp, checkLogin} = authActions;
const {addNotification, clearNotification} = notificationActions;
const {fetchAssetSuccess} = assetActions;
import {NEW_COMMENT_COUNT_POLL_INTERVAL} from 'coral-framework/constants/comments';

import {queryStream} from 'coral-framework/graphql/queries';
import {postComment, postFlag, postLike, postDontAgree, deleteAction, addCommentTag, removeCommentTag, ignoreUser} from 'coral-framework/graphql/mutations';
import {editName} from 'coral-framework/actions/user';
import {updateCountCache, viewAllComments} from 'coral-framework/actions/asset';
import {notificationActions, authActions, assetActions, pym} from 'coral-framework';

import Stream from './Stream';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import QuestionBox from 'coral-plugin-questionbox/QuestionBox';
import {ModerationLink} from 'coral-plugin-moderation';
import Count from 'coral-plugin-comment-count/CommentCount';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import UserBox from 'coral-sign-in/components/UserBox';
import SuspendedAccount from 'coral-framework/components/SuspendedAccount';
import ChangeUsernameContainer from '../../coral-sign-in/containers/ChangeUsernameContainer';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from 'coral-configure/containers/ConfigureStreamContainer';
import HighlightedComment from './Comment';
import LoadMore from './LoadMore';
import NewCount from './NewCount';

class Embed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      showSignInDialog: false,
      activeReplyBox: ''
    };
  }

  changeTab = (tab) => {

    // Everytime the comes from another tab, the Stream needs to be updated.
    if (tab === 0) {
      this.props.viewAllComments();
      this.props.data.refetch();
    }

    this.setState({
      activeTab: tab
    });
  }

  static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object
    }).isRequired,

    // dispatch action to add a tag to a comment
    addCommentTag: React.PropTypes.func,

    // dispatch action to remove a tag from a comment
    removeCommentTag: React.PropTypes.func,

    // dispatch action to ignore another user
    ignoreUser: React.PropTypes.func,
  }

  componentDidMount () {
    pym.sendMessage('childReady');
    this.props.checkLogin();
  }

  componentWillUnmount () {
    clearInterval(this.state.countPoll);
  }

  componentWillReceiveProps (nextProps) {
    const {loadAsset} = this.props;
    if(!isEqual(nextProps.data.asset, this.props.data.asset)) {
      loadAsset(nextProps.data.asset);

      const {getCounts, updateCountCache, asset: {countCache}} = this.props;
      const {asset} = nextProps.data;

      if (!countCache) {
        updateCountCache(asset.id, asset.commentCount);
      }

      this.setState({
        countPoll: setInterval(() => {
          const {asset} = this.props.data;
          getCounts({
            asset_id: asset.id,
            limit: asset.comments.length,
            sort: 'REVERSE_CHRONOLOGICAL'
          });
        }, NEW_COMMENT_COUNT_POLL_INTERVAL)
      });
    }
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(prevProps.data.comment, this.props.data.comment)) {

      // Scroll to a permalinked comment if one is in the URL once the page is done rendering.
      setTimeout(() => pym.scrollParentToChildEl('coralStream'), 0);
    }
  }

  setActiveReplyBox = (reactKey) => {
    if (!this.props.auth.user) {
      this.props.showSignInDialog();
    } else {
      this.setState({activeReplyBox: reactKey});
    }
  }

  render () {
    const {activeTab} = this.state;
    const {closedAt, countCache = {}} = this.props.asset;
    const {asset, refetch, comment} = this.props.data;
    const {loggedIn, isAdmin, user, showSignInDialog} = this.props.auth;

    // even though the permalinked comment is the highlighted one, we're displaying its parent + replies
    const highlightedComment = comment && comment.parent ? comment.parent : comment;

    const openStream = closedAt === null;

    const banned = user && user.status === 'BANNED';

    const hasOlderComments = !!(
      asset &&
      asset.lastComment &&
      asset.lastComment.id !== asset.comments[asset.comments.length - 1].id
    );

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 200
    } : {};

    if (!asset) {
      return <Spinner />;
    }

    // Find the created_at date of the first comment. If no comments exist, set the date to a week ago.
    const firstCommentDate = asset.comments[0]
      ? asset.comments[0].created_at
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();

    const userBox = <UserBox user={user} logout={() => this.props.logout().then(refetch)}  changeTab={this.changeTab}/>;

    // TODO: This is a quickfix and will be replaced after our refactor.
    const ignoredUsers = this.props.userData.ignoredUsers;
    const commentIsIgnored = (comment) => ignoredUsers && ignoredUsers.includes(comment.user.id);

    return (
      <div style={expandForLogin}>
        <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={asset.totalCommentCount}/></Tab>
            <Tab>{lang.t('my_profile')}</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
          {
            highlightedComment &&
            <Button
              cStyle='darkGrey'
              style={{float: 'right'}}
              onClick={() => {
                this.props.viewAllComments();
                this.props.data.refetch();
              }}>{lang.t('showAllComments')}</Button>
          }
          <TabContent show={activeTab === 0}>
            { loggedIn ? userBox : null }
            {
              openStream
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
                       editName={this.props.editName}
                       />
                   }>
                   {
                     user
                     ? <CommentBox
                        addNotification={this.props.addNotification}
                        postItem={this.props.postItem}
                        appendItemArray={this.props.appendItemArray}
                        updateItem={this.props.updateItem}
                        updateCountCache={this.props.updateCountCache}
                        countCache={countCache[asset.id]}
                        assetId={asset.id}
                        premod={asset.settings.moderation}
                        isReply={false}
                        currentUser={this.props.auth.user}
                        authorId={user.id}
                        charCountEnable={asset.settings.charCountEnable}
                        maxCharCount={asset.settings.charCount} />
                     : null
                   }
                 </RestrictedContent>
                 </div>
               : <p>{asset.settings.closedMessage}</p>
            }

            {!loggedIn && <Button id='coralSignInButton' onClick={this.props.showSignInDialog} full>Sign in to comment</Button>}

            {loggedIn && user && <ChangeUsernameContainer loggedIn={loggedIn} user={user} />}
            {loggedIn && <ModerationLink assetId={asset.id} isAdmin={isAdmin} />}

            {/* the highlightedComment is isolated after the user followed a permalink */}
            {
              highlightedComment
              ? <HighlightedComment
                refetch={refetch}
                setActiveReplyBox={this.setActiveReplyBox}
                activeReplyBox={this.state.activeReplyBox}
                addNotification={this.props.addNotification}
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
                commentIsIgnored={commentIsIgnored}
                key={highlightedComment.id}
                reactKey={highlightedComment.id}
                comment={highlightedComment} />
              : <div>
                <NewCount
                  commentCount={asset.commentCount}
                  countCache={countCache[asset.id]}
                  loadMore={this.props.loadMore}
                  firstCommentDate={firstCommentDate}
                  assetId={asset.id}
                  updateCountCache={this.props.updateCountCache}
                  />
                <div className="embed__stream">
                  <Stream
                    open={openStream}
                    addNotification={this.props.addNotification}
                    postItem={this.props.postItem}
                    setActiveReplyBox={this.setActiveReplyBox}
                    activeReplyBox={this.state.activeReplyBox}
                    asset={asset}
                    currentUser={user}
                    postLike={this.props.postLike}
                    postFlag={this.props.postFlag}
                    postDontAgree={this.props.postDontAgree}
                    addCommentTag={this.props.addCommentTag}
                    removeCommentTag={this.props.removeCommentTag}
                    ignoreUser={this.props.ignoreUser}
                    loadMore={this.props.loadMore}
                    deleteAction={this.props.deleteAction}
                    showSignInDialog={this.props.showSignInDialog}
                    comments={asset.comments}
                    maxCharCount={asset.settings.charCount}
                    charCountEnable={asset.settings.charCountEnable}
                    ignoredUsers={this.props.userData.ignoredUsers} />
                </div>
                <LoadMore
                  topLevel={true}
                  assetId={asset.id}
                  comments={asset.comments}
                  moreComments={hasOlderComments}
                  loadMore={this.props.loadMore} />
              </div>
            }
          </TabContent>
          <TabContent show={activeTab === 1}>
            <ProfileContainer
              loggedIn={loggedIn}
              userData={this.props.userData}
            />
          </TabContent>
          <TabContent show={activeTab === 2}>
            <RestrictedContent restricted={!loggedIn}>
              { loggedIn ? userBox : null }
              <ConfigureStreamContainer
                status={status}
                onClick={this.toggleStatus}
              />
            </RestrictedContent>
          </TabContent>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  userData: state.user.toJS(),
  asset: state.asset.toJS(),
});

const mapDispatchToProps = dispatch => ({
  requestConfirmEmail: () => dispatch(requestConfirmEmail()),
  loadAsset: (asset) => dispatch(fetchAssetSuccess(asset)),
  addNotification: (type, text) => addNotification(type, text),
  clearNotification: () => dispatch(clearNotification()),
  editName: (username) => dispatch(editName(username)),
  showSignInDialog: () => dispatch(showSignInDialog()),
  updateCountCache: (id, count) => dispatch(updateCountCache(id, count)),
  viewAllComments: () => dispatch(viewAllComments()),
  logout: () => dispatch(logout()),
  openSignInPopUp: cb => dispatch(openSignInPopUp(cb)),
  checkLogin: () => dispatch(checkLogin()),
  dispatch: d => dispatch(d),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  postComment,
  postFlag,
  postLike,
  postDontAgree,
  addCommentTag,
  removeCommentTag,
  ignoreUser,
  deleteAction,
  queryStream,
)(Embed);
