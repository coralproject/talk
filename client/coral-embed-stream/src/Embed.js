import React, {Component} from 'react';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);
import {graphImporter} from 'coral-framework/helpers/plugins';

import {TabBar, Tab, TabContent, Spinner} from 'coral-ui';

const {logout, showSignInDialog, requestConfirmEmail} = authActions;
const {addNotification, clearNotification} = notificationActions;
const {fetchAssetSuccess} = assetActions;

import {queryStream} from 'coral-framework/graphql/queries';
import {postComment, postFlag, postLike, postDontAgree, deleteAction, addCommentTag, removeCommentTag} from 'coral-framework/graphql/mutations';
import {editName} from 'coral-framework/actions/user';
import {updateCountCache} from 'coral-framework/actions/asset';
import {notificationActions, authActions, assetActions, pym, Slot, actions} from 'coral-framework';

import Stream from './Stream';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import QuestionBox from 'coral-plugin-questionbox/QuestionBox';
import {ModerationLink} from 'coral-plugin-moderation';
import Count from 'coral-plugin-comment-count/CommentCount';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import UserBox from 'coral-sign-in/components/UserBox';
import SignInContainer from 'coral-sign-in/containers/SignInContainer';
import SuspendedAccount from 'coral-framework/components/SuspendedAccount';
import ChangeUsernameContainer from '../../coral-sign-in/containers/ChangeUsernameContainer';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from 'coral-configure/containers/ConfigureStreamContainer';
import Comment from './Comment';
import LoadMore from './LoadMore';
import NewCount from './NewCount';

class Embed extends Component {

  state = {activeTab: 0, showSignInDialog: false, activeReplyBox: ''};

  changeTab = (tab) => {

    // Everytime the comes from another tab, the Stream needs to be updated.
    if (tab === 0) {
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
  }

  componentDidMount () {
    pym.sendMessage('childReady');
  }

  componentWillReceiveProps (nextProps) {
    const {loadAsset} = this.props;
    if(!isEqual(nextProps.data.asset, this.props.data.asset)) {
      loadAsset(nextProps.data.asset);
    }
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(prevProps.data.comment, this.props.data.comment)) {

      // Scroll to a permalinked comment if one is in the URL once the page is done rendering.
      setTimeout(()=>pym.scrollParentToChildEl(`c_${this.props.data.comment.id}`), 0);
    }
  }

  setActiveReplyBox = (reactKey) => {
    if (!this.props.auth.user) {
      const offset = document.getElementById(`c_${reactKey}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
    } else {
      this.setState({activeReplyBox: reactKey});
    }
  }

  render () {
    const {activeTab} = this.state;
    const {closedAt, countCache = {}} = this.props.asset;
    const {loading, asset, refetch, comment} = this.props.data;
    const {loggedIn, isAdmin, user, showSignInDialog, signInOffset} = this.props.auth;
    const highlightedComment = comment && comment.parent ? comment.parent : comment;

    const openStream = closedAt === null;

    const banned = user && user.status === 'BANNED';

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 200
    } : {};

    if (loading || !asset) {
      return <Spinner />;
    }

    // Find the created_at date of the first comment. If no comments exist, set the date to a week ago.
    const firstCommentDate = asset.comments[0]
      ? asset.comments[0].created_at
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();

    /**
     * Plugins Section
     *
     */
    const {dispatch} = this.props;
    const {pluginActions} = actions;
    let boundActionCreators = bindActionCreators(pluginActions, dispatch);

    const pluginProps = {
      ...this.props,
      actions: boundActionCreators
    };

    return (
      <div style={expandForLogin}>
        <div className="commentStream">
          <Slot fill="Stream" {...pluginProps} />
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={asset.totalCommentCount}/></Tab>
            <Tab>{lang.t('MY_COMMENTS')}</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
          {loggedIn && <UserBox user={user} logout={() => this.props.logout().then(refetch)}  changeTab={this.changeTab}/>}
          <TabContent show={activeTab === 0}>
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
            {
              highlightedComment &&
              <Comment
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
                key={highlightedComment.id}
                reactKey={highlightedComment.id}
                comment={highlightedComment}
                pluginProps={pluginProps}
              />
            }
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
                getCounts={this.props.getCounts}
                addCommentTag={this.props.addCommentTag}
                removeCommentTag={this.props.removeCommentTag}
                updateCountCache={this.props.updateCountCache}
                loadMore={this.props.loadMore}
                deleteAction={this.props.deleteAction}
                showSignInDialog={this.props.showSignInDialog}
                comments={asset.comments}
                pluginProps={pluginProps}
              />
            </div>
          <LoadMore
            topLevel={true}
            assetId={asset.id}
            comments={asset.comments}
            moreComments={countCache[asset.id] > asset.comments.length}
            loadMore={this.props.loadMore}/>
        </TabContent>
         <TabContent show={activeTab === 1}>
           <ProfileContainer
             loggedIn={loggedIn}
             userData={this.props.userData}
             showSignInDialog={this.props.showSignInDialog}
           />
         </TabContent>
         <TabContent show={activeTab === 2}>
           <RestrictedContent restricted={!loggedIn}>
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

const mapStateToProps = (state) => Object
  .keys(state)
  .reduce((entry, key) => {
    if (key !== 'apollo') {
      entry[key] = state[key].toJS();
    }
    return entry;
  }, {});

const mapDispatchToProps = dispatch => ({
  requestConfirmEmail: () => dispatch(requestConfirmEmail()),
  loadAsset: (asset) => dispatch(fetchAssetSuccess(asset)),
  addNotification: (type, text) => addNotification(type, text),
  clearNotification: () => dispatch(clearNotification()),
  editName: (username) => dispatch(editName(username)),
  showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
  updateCountCache: (id, count) => dispatch(updateCountCache(id, count)),
  logout: () => dispatch(logout()),
  dispatch: d => dispatch(d)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  postComment,
  postFlag,
  postLike,
  postDontAgree,
  addCommentTag,
  removeCommentTag,
  deleteAction,
  queryStream,
  ...graphImporter
)(Embed);
